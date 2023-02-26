import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { SecurityUtil } from 'src/utils/security.util';
import { Repository } from 'typeorm';
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


}
