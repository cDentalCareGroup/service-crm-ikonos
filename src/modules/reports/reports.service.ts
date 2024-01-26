import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPatientAppointmentsReportsDTO } from './models/reports.dto';
import { PatientEntity } from '../patient/models/patient.entity';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(AppointmentEntity)
    private appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async findBetweenDates(dates: GetPatientAppointmentsReportsDTO): Promise<any[]> {
    try {
      const startDate = new Date(dates.startedAt);
      const endDate = new Date(dates.finishedAt);
      if (startDate > endDate) {
        throw new ValidationException(ValidationExceptionType.ERROR_DATES);
      }

      const result = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .innerJoin('patient', 'patient', 'patient.id = appointment.patientId')
        .where('appointment.appointment BETWEEN :startDate AND :endDate', {
           startDate,
           endDate,
        })
        .select([
          'patient.name AS name',
          'patient.primaryContact AS primaryContact',
          'patient.lastname AS lastname',
          'DATE_FORMAT(appointment.appointment, "%Y-%m-%d") AS appointment',
        ])
        .getRawMany();

      return result;
    } catch (error) {
      HandleException.exception(error);
    }
  }
}
