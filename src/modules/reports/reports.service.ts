import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from '../patient/models/patient.entity';
import { AppointmentEntity } from '../appointment/models/appointment.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(AppointmentEntity)
    private appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async findBetweenDates(
    startDateString: string,
    endDateString: string,
  ): Promise<any[]> {
    try {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      if (startDate > endDate) {
        throw new BadRequestException(
          'La fecha de inicio debe ser menor o igual a la fecha de fin',
        );
      }
      return this.appointmentRepository
        .createQueryBuilder('a')
        .innerJoin('a.patient', 'p')
        .where('a.appointment BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .select(['p.name', 'p.primaryContact', 'p.lastname', 'a.appointment'])
        .getMany();
    } catch (error) {
      console.log(error);
    }
  }
}
