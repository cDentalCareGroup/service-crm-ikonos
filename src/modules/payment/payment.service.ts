import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { getTodayDateAndConvertToDate } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { MovementsTypeEntity } from './models/movements.type.entity';
import { RegisterPaymentDTO } from './models/payment.dto';
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
            const data = await this.movementsTypeRepository.find();
            return data.filter((value, _) =>
                value.name.toLowerCase() == 'pago' || value.name.toLowerCase() == 'anticipo'
            );
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

            let arrayDepostis = [];

            for await (const deposit of deposits) {
                let totalDeposit = 0;
                const depositDetail = await this.paymentDetailRepository.findBy({ paymentId: deposit.id });
                console.log(depositDetail)
                totalDeposit += depositDetail.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                arrayDepostis.push({
                    'deposit': deposit,
                    'amountDeposit': deposit.amount - totalDeposit
                });
            }

            let arrayDebts = [];

            for await (const debt of debts) {
                let totalDebt = 0;
                const debtDetail = await this.paymentDetailRepository.findBy({ paymentId: debt.id });
                totalDebt += debtDetail.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                arrayDebts.push({
                    'debt': debt,
                    'amountDebt': debt.amount - totalDebt
                });
            }
            return {
                'deposits': arrayDepostis,
                'debts': arrayDebts
            }
        } catch (error) {
            HandleException.exception(error);
        }
    }

    registerPatientMovement = async (body: RegisterPaymentDTO) => {
        try {
            //   console.log(body);
            const movement = await this.movementsTypeRepository.findOneBy({ id: body.movementType });
            if (movement != null && movement.name.toLowerCase() == 'anticipo') {
                const paymentDeposit = new PaymentEntity();
                paymentDeposit.patientId = body.patientId;
                paymentDeposit.movementTypeId = movement.id;
                paymentDeposit.amount = Number(body.amount);
                paymentDeposit.movementType = movement.type;
                paymentDeposit.movementSign = '1';
                paymentDeposit.status = 'A';
                return await this.paymentRepository.save(paymentDeposit);
            } else if (movement != null && movement.name.toLowerCase() == 'pago') {
                for await (const item of body.debts) {
                    const debt = await this.paymentRepository.findOneBy({ id: item.debt.id });
                    const debts = await this.paymentDetailRepository.findBy({ paymentId: debt.id });
                    // console.log(debt)
                    if (debt != null) {
                        const paymentItemPaid = new PaymentDetailEntity();
                        paymentItemPaid.patientId = debt.patientId;
                        paymentItemPaid.paymentId = debt.id;
                        paymentItemPaid.referenceId = debt.id;
                        paymentItemPaid.movementTypeApplicationId = movement.id;
                        paymentItemPaid.movementType = 'A'
                        paymentItemPaid.amount = Number(item.debt.aplicableAmount);
                        paymentItemPaid.paymentMethodId = body.paymentMethodId;
                        paymentItemPaid.sign = '-1'
                        paymentItemPaid.order = debts.length + 1;
                        await this.paymentDetailRepository.save(paymentItemPaid);

                        let totalAmountDebts = debts.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                        totalAmountDebts += Number(item.debt.aplicableAmount);
                        console.log(`Total ${totalAmountDebts} - Deuda ${Number(debt.amount)} = Result  ${Number(debt.amount) - totalAmountDebts}`);
                        if (totalAmountDebts >= Number(debt.amount)) {
                            debt.status = 'C';
                            debt.dueDate = getTodayDateAndConvertToDate();
                            await this.paymentRepository.save(debt);
                        }
                    }
                }
            } else {
                console.log('otro')
            }
            return 200;
        } catch (error) {
            console.log(error);
            HandleException.exception(error);
        }
    }


    getPatientPaymentAccount = async (body: any) => {
        try {
            let data: any[] = [];
            const appointments = await this.appointmentRepository.findBy({ patientId: Number(body.patientId) })
            //console.log(appointments)
            for await (const appointment of appointments) {
                const payment = await this.paymentRepository.findOneBy({ referenceId: appointment.id });
                if (payment != null) {
                    const paymentDetail = await this.paymentDetailRepository.findBy({ paymentId: payment.id });
                    data.push({
                        'paymentInfo': {
                            'payment': payment,
                            'details': paymentDetail
                        },
                        'appointmentInfo': {
                            'appointment': await this.appointmentService.getAppointment(appointment),
                            'services': await this.appointmentService.getAppointmentServices(appointment.id)
                        }
                    })
                } else {
                    data.push({
                        'appointmentInfo': {
                            'appointment': await this.appointmentService.getAppointment(appointment),
                            'services': await this.appointmentService.getAppointmentServices(appointment.id)
                        }
                    })
                }
            }
            return data;
        } catch (error) {
            console.log(error);
            HandleException.exception(error);
        }
    }

}
