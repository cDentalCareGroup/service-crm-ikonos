import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { isPast, isToday } from 'date-fns';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { getSimpleTodayDate, getTodayDate, STATUS_ACTIVE, STATUS_FINISHED, STATUS_SOLVED } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { AppointmentStatistic, BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { CallEntity } from '../calls/models/call.entity';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { PaymentEntity } from '../payment/models/payment.entity';
import { PaymentDetailEntity } from '../payment/payment.detail.entity';
import { GetStatisticsCallsDTO } from './models/statistics.dto';

@Injectable()
export class StatisticService {
    constructor(
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        @InjectRepository(PatientEntity) private patientsRepository: Repository<PatientEntity>,
        @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
        @InjectRepository(PaymentDetailEntity) private paymentDetailRepository: Repository<PaymentDetailEntity>,
    ) { }


    getGeneralStatistics = async () => {
        try {
            const calls = await this.callRepository.find();
            const attendedDate = getTodayDate().split(' ')[0];
            const pendingCallsToday = calls.filter((value, _) => value.status == 'activa' && value.dueDate == attendedDate);
            const solvedCallsToday = calls.filter((value, _) => value.status == 'resuelta' && value.dueDate == attendedDate);

            const data = await this.branchOfficeRepository.find({ where: { status: 1 } });
            let branchOffices: BranchOfficeEntity[] = [];
            for await (const branchOffice of data) {
                const appointments = await this.appointmentRepository.findBy({ branchId: branchOffice.id });
                const active = appointments.filter((value, _) => value.status == 'activa');
                const proccess = appointments.filter((value, _) => value.status == 'proceso');
                const finished = appointments.filter((value, _) => value.status == 'finalizada');
                const noAttended = appointments.filter((value, _) => value.status == 'no-atendida');
                const item = branchOffice;
                item.appointment = new AppointmentStatistic(active.length, proccess.length, finished.length, noAttended.length);
                branchOffices.push(item);
            }


            return {
                'calls': {
                    'pending': pendingCallsToday,
                    'attended': solvedCallsToday
                },
                'branchOffices': branchOffices
            }

        } catch (exception) {
            HandleException.exception(exception);
        }
    }


    getStatisticsCalls = async () => {
        try {
            //We get all the calls from CallEntity
            const calls = await this.callRepository.find();

            //We filter according to the status
            const activeCalls = calls.filter((value, _) => value.status == STATUS_ACTIVE);
            const solvedCalls = calls.filter((value, _) => value.status == STATUS_SOLVED);
            const expiredCalls = calls.filter((value, _) => isPast(new Date(value.dueDate)) && value.status == STATUS_ACTIVE);
            return new GetStatisticsCallsDTO(activeCalls, solvedCalls, expiredCalls);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    getStatisticsBalance = async () => {
        try {
            //const branchOfficeId = 10;
            let data = [];
            const branchOffices = await this.branchOfficeRepository.findBy({ status: 1 });
            const todayDate = getSimpleTodayDate();

            for await (const item of branchOffices) {
                const appointments = await this.appointmentRepository.findBy({ branchId: item.id, appointment: todayDate, status: STATUS_FINISHED });
                let totalBalance = 0;
                let totalDebts = 0;
                let total = 0;
                for await (const appointment of appointments) {
                    const payment = await this.paymentRepository.findOneBy({ referenceId: appointment.id });
                    if (payment != null) {
                        total += Number(payment.amount);
                        if (payment.status == 'C') {
                            totalBalance += Number(payment.amount);
                        } else {
                            const debtDetail = await this.paymentDetailRepository.findBy({ paymentId: payment.id });
                            const totalDebt = debtDetail.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                            totalBalance += totalDebt;
                            totalDebts += Number(payment.amount) - totalDebt;
                        }
                    }
                }
                data.push({
                    'branchOffice': item,
                    'total': total,
                    'balance': totalBalance,
                    'pending': totalDebts,
                    'date': todayDate,
                });
            }
            return data;
        } catch (error) {
            HandleException.exception(error);
        }
    }
}
