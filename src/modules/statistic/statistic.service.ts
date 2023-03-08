import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { isPast, isToday } from 'date-fns';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { getTodayDate, STATUS_ACTIVE, STATUS_SOLVED } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { AppointmentStatistic, BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { CallEntity } from '../calls/models/call.entity';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { PatientEntity } from '../patient/models/patient.entity';

@Injectable()
export class StatisticService {
    constructor(
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        @InjectRepository(PatientEntity) private patientsRepository: Repository<PatientEntity>,
        @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
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
            const calls = await this.callRepository.find();

            const activeCalls = calls.filter((value, _) => value.status == STATUS_ACTIVE);
            const solvedCalls = calls.filter((value, _) => value.status == STATUS_SOLVED);
            const expiredCalls = calls.filter((value, _) => isPast(new Date(value.dueDate)) && value.status == STATUS_ACTIVE);
            return {
                'active': activeCalls,
                'solvedCalls': solvedCalls,
                'expiredCalls': expiredCalls
            }
        } catch (error) {
            HandleException.exception(error);
        }
    }



}
