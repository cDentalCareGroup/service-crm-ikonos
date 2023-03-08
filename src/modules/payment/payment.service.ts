import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { getTodayDateToDate } from 'src/utils/general.functions.utils';
import { SecurityUtil } from 'src/utils/security.util';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { MovementsTypeEntity } from './models/movements.type.entity';
import { PaymentEntity } from './models/payment.entity';
import { PaymentDetailEntity } from './payment.detail.entity';

@Injectable()
export class PaymentService {


    constructor(
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
        @InjectRepository(PaymentDetailEntity) private paymentDetailRepository: Repository<PaymentDetailEntity>,
        @InjectRepository(MovementsTypeEntity) private movementsTypeRepository: Repository<MovementsTypeEntity>,
        private appointmentService: AppointmentService
    ) { }

    registerPayment = async (body: any) => {
        try {

            //console.log(body);
            const appointment = await this.appointmentRepository.findOneBy({ id: body.appointmentId });
            const payment = await this.paymentRepository.findOneBy({ referenceId: appointment.id, patientId: appointment.patientId });
            const payments = await this.paymentDetailRepository.findBy({ paymentId: payment.id });

            if (body.type == 'payment') {
                let total = 0;
                payments.forEach((value, _) => {
                    total += value.amount;
                });
                total = Number(total);

                if ((total + Number(body.amount)) >= payment.amount) {

                    // const paymentDetail = new PaymentDetailEntity();
                    // paymentDetail.patientId = payment.patientId;
                    // paymentDetail.referenceId = payment.referenceId;
                    // paymentDetail.paymentId = payment.id;
                    // paymentDetail.movementType = 'A';
                    // paymentDetail.movementTypeApplicationId = 1;
                    // paymentDetail.amount = Number(body.amount);
                    // paymentDetail.createdAt = new Date();
                    // paymentDetail.status = 'C';
                    // paymentDetail.sign = '1';
                    // paymentDetail.order = payments.length + 1;
                    // paymentDetail.paymentMethodId = body.paymentMethod;
                    //await this.paymentDetailRepository.save(paymentDetail);
                    payment.status = 'C';
                    //await this.paymentRepository.save(payment);

                } else {
                    const paymentDetail = new PaymentDetailEntity();
                    paymentDetail.patientId = payment.patientId;
                    paymentDetail.referenceId = payment.referenceId;
                    paymentDetail.paymentId = payment.id;
                    paymentDetail.movementType = 'A';
                    paymentDetail.movementTypeApplicationId = 1;
                    paymentDetail.amount = Number(body.amount);
                    paymentDetail.createdAt = new Date();
                    paymentDetail.sign = '1';
                    paymentDetail.order = payments.length + 1;
                    paymentDetail.paymentMethodId = body.paymentMethod;
                    //await this.paymentDetailRepository.save(paymentDetail);
                }
            } else if (body.type == 'advancePayment') {

            }


        } catch (error) {
            console.log(`registerPayment`, error);
            HandleException.exception(error);
        }
    }



    getTypes = async () => {
        try {
            return await this.movementsTypeRepository.find();
        } catch (error) {
            HandleException.exception(error);
        }
    }


    gatPatientPayments = async (body: any) => {
        try {
            // console.log(body)
            const movementDeposit = await this.movementsTypeRepository.findOneBy({ name: 'Anticipo' });
            const deposits = await this.paymentRepository.findBy({ patientId: body.patientId, status: 'A', movementTypeId: movementDeposit.id });

            const movementDebts = await this.movementsTypeRepository.findOneBy({ name: 'Cita' });
            const debts = await this.paymentRepository.findBy({ patientId: body.patientId, status: 'A', movementTypeId: movementDebts.id });


            let arrayDebts = [];

            let totalDebt = 0;
            for await (const debt of debts) {
                const debtDetail = await this.paymentDetailRepository.findBy({ paymentId: debt.id });
                totalDebt += debtDetail.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                arrayDebts.push({
                    'debt': debt,
                    'amountDebt': debt.amount - totalDebt
                });
            }
            return {
                'deposits': deposits,
                'debts': arrayDebts
            }
        } catch (error) {
            HandleException.exception(error);
        }
    }

    registerPatientMovement = async (body: any) => {
        try {
            console.log(body);
            const movement = await this.movementsTypeRepository.findOneBy({ id: body.movementType });
            if (movement != null) {
                const paymentDeposit = new PaymentEntity();
                paymentDeposit.patientId = body.patientId;
                paymentDeposit.movementTypeId = movement.id;
                paymentDeposit.amount = Number(body.amount);
                paymentDeposit.movementType = movement.type;
                paymentDeposit.movementSign = '1';
                paymentDeposit.createdAt = new Date();
                paymentDeposit.status = 'A';
               // return await this.paymentRepository.save(paymentDeposit);
            }
            return 200;
        } catch (error) {
            HandleException.exception(error);
        }
    }


}
