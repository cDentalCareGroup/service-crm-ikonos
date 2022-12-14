import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { async } from 'rxjs';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { getDiff, getRandomInt } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { BranchOfficeScheduleEntity } from '../branch_office/models/branch.office.schedule.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { AppointmentAvailabilityDTO, AvailableHoursDTO, RegisterAppointmentRequestDTO } from './models/appointment.dto';
import { AppointmentEntity } from './models/appointment.entity';
import { ProspectEntity } from './models/prospect.entity';

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
    @InjectRepository(BranchOfficeScheduleEntity) private branchOfficeScheduleRepository: Repository<BranchOfficeScheduleEntity>,
    @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
    @InjectRepository(ProspectEntity) private prospectEntity: Repository<ProspectEntity>,

  ) { }

  getAppointmentsAvailability = async ({ branchOfficeName, dayName }: AppointmentAvailabilityDTO): Promise<AvailableHoursDTO[]> => {
    try {

      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchOfficeName });
      const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status: 'activo', dayName: dayName } });

      let availableHours: AvailableHoursDTO[] = [];
      const data: AvailableHoursDTO[] = [];
      const today = new Date();
      let currentDay = today.getDate();
      const formatedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
      const halfMinutes = '30';
      for await (const dayTime of schedule) {

        const startTime = dayTime.startTime.toString();
        const startTimeArray = startTime.split(":");
        const startHour = Number(startTimeArray[0]);
        const startMinutes = Number(startTimeArray[1]);
        const startSeconds = Number(startTimeArray[2]);
        const startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, startHour, startMinutes, startSeconds))

        const endTime = dayTime.endTime.toString();
        const endTimeArray = endTime.split(":");
        const endHour = Number(endTimeArray[0]);
        const endMinutes = Number(endTimeArray[1]);
        const endSeconds = Number(endTimeArray[2]);
        const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, endHour, endMinutes, endSeconds))

        const dif = getDiff(startDate, endDate) + 1;

        for (let index = 0; index < dif; index++) {
          let hourToAdd = (startHour + index);
          let hourResult = hourToAdd < 10 ? `0${hourToAdd}` : hourToAdd;
          let amOrPm = hourToAdd < 12 ? 'AM' : 'PM';
          if (hourToAdd < endHour) {
            if (startMinutes == 0) {
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:00 ${amOrPm}`,
                  `${hourResult}:00:00`,
                  dayTime.seat,
                  dayTime.id
                ));
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:30 ${amOrPm}`,
                  `${hourResult}:30:00`,
                  dayTime.seat,
                  dayTime.id
                ));
            } else {
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:${startMinutes}0 ${amOrPm}`,
                  `${hourResult}:${startMinutes}0:00`,
                  dayTime.seat,
                  dayTime.id
                ));
            }
          }
        }

      }

      for await (const hour of availableHours) {
        const appointments = await this.appointmentRepository.findBy({
          branchId: branchOffice.id,
          appointment: formatedDate,
          time: hour.simpleTime
        });
        if (appointments.length < hour.seat) {
          data.push(hour);
        }
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  registerAppointment = async ({ date, branchName, time, phone, email, name }: RegisterAppointmentRequestDTO) => {
    try {


      if (name == null || name == undefined || name == '' ||
        phone == null || phone == undefined || phone == '') throw new ValidationException(ValidationExceptionType.MISSING_VALUES);

      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchName });
      let patient: PatientEntity;
      let prospect: ProspectEntity;

      if (phone != null && phone != '') {
        patient = await this.patientRepository.findOneBy({ primaryContact: phone });
      }
      if (email != null && email != '' && patient == null) {
        patient = await this.patientRepository.findOneBy({ email: email });
      }

      if (patient == null || patient == undefined) {
        prospect = await this.prospectEntity.findOneBy({ name: name, primaryContact: phone });
        if (prospect == null || prospect == undefined) {
          const newProspect = new ProspectEntity();
          newProspect.name = name;
          newProspect.email = email;
          newProspect.primaryContact = phone;
          newProspect.createdAt = new Date();
          prospect = await this.prospectEntity.save(newProspect);
        }
      }

      const exists = await this.appointmentRepository.findOneBy({
        branchId: branchOffice.id, 
        branchName: branchOffice.name,
        appointment: date.toString().split("T")[0],
        time: time.simpleTime,
        prospectId: prospect?.id,
      });

      if (exists != null) throw new ValidationException(ValidationExceptionType.APPOINTMENT_EXISTS);

      const entity = new AppointmentEntity();
      entity.appointment = date.toString().split("T")[0]
      entity.branchId = branchOffice.id;
      entity.branchName = branchOffice.name;
      entity.scheduleBranchOfficeId = time.scheduleBranchOfficeId;
      entity.time = time.simpleTime;
      entity.scheduledAt = new Date();
      const folio = randomUUID().replace(/-/g, getRandomInt()).substring(0, 20)
      entity.folio = folio;
      entity.prospectId = prospect?.id ?? null;
      entity.patientId = patient?.id ?? null;


      const response = await this.appointmentRepository.save(entity);
      return {
        'branchOffice': branchOffice,
        'patientInfo': {
          'name': name,
          'phone': phone,
          'email': email
        },
        'appointment': {
          'date': response.appointment,
          'time': response.time,
          'folio': response.folio,
          'status': response.status
        }
      }
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }
}
