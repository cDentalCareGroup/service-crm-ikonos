import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { formatISO } from 'date-fns';
import { HandleException, NotFoundCustomException, NotFoundType, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { getDiff, getRandomInt, getTodayDate } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/models/entities/user.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { BranchOfficeScheduleEntity } from '../branch_office/models/branch.office.schedule.entity';
import { AppointmentTemplateMail, EmailService } from '../email/email.service';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { AppointmentAvailabilityDTO, AppointmentDetailDTO, AvailableHoursDTO, GetAppointmentDetailDTO, GetAppointmentsByBranchOfficeDTO, RegisterAppointmentDentistDTO, RegisterAppointmentDTO, RescheduleAppointmentDTO, UpdateAppointmentStatusDTO } from './models/appointment.dto';
import { AppointmentEntity } from './models/appointment.entity';
import { ProspectEntity } from './models/prospect.entity';

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
    @InjectRepository(BranchOfficeScheduleEntity) private branchOfficeScheduleRepository: Repository<BranchOfficeScheduleEntity>,
    @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
    @InjectRepository(ProspectEntity) private prospectRepository: Repository<ProspectEntity>,
    @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private emailService: EmailService
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

  registerAppointment = async ({ date, branchName, time, phone, email, name }: RegisterAppointmentDTO): Promise<string> => {
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
        prospect = await this.prospectRepository.findOneBy({ name: name, primaryContact: phone });
        if (prospect == null || prospect == undefined) {
          const newProspect = new ProspectEntity();
          newProspect.name = name;
          newProspect.email = email;
          newProspect.primaryContact = phone;
          newProspect.createdAt = new Date();
          prospect = await this.prospectRepository.save(newProspect);
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
      entity.scheduledAt = getTodayDate()
      const folio = randomUUID().replace(/-/g, getRandomInt()).substring(0, 20).toUpperCase()
      entity.folio = folio;
      entity.prospectId = prospect?.id ?? null;
      entity.patientId = patient?.id ?? null;
      entity.comments = `Cita registrada ${date.toString().split("T")[0]} ${time.simpleTime}`

      const response = await this.appointmentRepository.save(entity);

      if (email != null && email != undefined) {
        await this.emailService.sendAppointmentEmail(
          new AppointmentTemplateMail(
            name,
            `${date.toString().split("T")[0]} ${time.simpleTime}`,
            `${branchOffice.street} ${branchOffice.number} ${branchOffice.colony}, ${branchOffice.cp}`,
            `${branchOffice.name}`,
            `${branchOffice.primaryContact}`,
            `${folio}`,
            `${phone ?? '-'}`
          ),
          email);
      }
      return response.folio;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  getAppointmentDetail = async (body: AppointmentDetailDTO): Promise<GetAppointmentDetailDTO> => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ folio: body.folio, status: 'activa' });
      if (appointment == null) throw new NotFoundCustomException(NotFoundType.APPOINTMENT_NOT_FOUND);
      return this.getAppointment(appointment);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  getAllAppointmentByBranchOffice = async (body: GetAppointmentsByBranchOfficeDTO): Promise<GetAppointmentDetailDTO[]> => {
    try {
      const data: GetAppointmentDetailDTO[] = [];
     
      const appointments = await this.appointmentRepository.findBy({branchId: Number(body.id)});
      for await (const appointment of appointments) {
        const result = await this.getAppointment(appointment)
        data.push(result);
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  appointmentReminders = async () => {
    try {
      const date = new Date();
      //date.setDate(date.getDate() + 1);

      const nextDate = date.toISOString().split("T")[0];
      const result = await this.appointmentRepository.find({ where: { appointment: nextDate, status: 'activa' } });
      let failureEmails = [];
      for await (const appointment of result) {
        let prospect: ProspectEntity;
        let patient: PatientEntity;

        if (appointment.patientId == null) {
          prospect = await this.prospectRepository.findOneBy({ id: appointment.prospectId });
        } else {
          patient = await this.patientRepository.findOneBy({ id: appointment.patientId });
        }
        const branchOffice = await this.branchOfficeRepository.findOneBy({ id: appointment.branchId });

        if (prospect?.email || patient?.email) {
          const name = prospect?.name ?? `${patient?.name} ${patient?.lastname} ${patient?.secondLastname}`;
          const email = prospect?.email ?? patient?.email;
          const isSuccess = await this.emailService.sendAppointmentConfirmationEmail(
            new AppointmentTemplateMail(
              name,
              `${appointment.appointment} ${appointment.time}`,
              `${branchOffice.street} ${branchOffice.number} ${branchOffice.colony}, ${branchOffice.cp}`,
              `${branchOffice.name}`,
              `${branchOffice.primaryContact}`,
              `${appointment.folio}`,
              `${prospect?.primaryContact ?? patient?.primaryContact}`,
            ),
            email
          );
          if (isSuccess != 1) {
            failureEmails.push(appointment);
          }
        }
      }
      return failureEmails;
    } catch (exception) {
      console.log(exception);
    }
  }

  registerAppointmentDentist = async ({ id, appointmentId, username }: RegisterAppointmentDentistDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(appointmentId) });
      const receptionist = await this.userRepository.findOneBy({ username: username });
      appointment.dentistId = Number(id);
      appointment.receptionistId = receptionist.id;
      appointment.comments = `${appointment.comments} \n Dentista asignado ${id} \n Recepcionista ${receptionist.name}`
      const updatedAppointment = await this.appointmentRepository.save(appointment);
      return this.getAppointment(updatedAppointment);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  updateAppointmentStatus = async ({ id, status }: UpdateAppointmentStatusDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(id) });
      if (status == 'proceso'){
        appointment.startedAt = formatISO(new Date())
        appointment.status = 'proceso';
        appointment.comments = `${appointment.comments} \n Estatus: proceso ${formatISO(new Date())}`
      }
      if (status == 'finalizada'){
        appointment.finishedAt = formatISO(new Date())
        appointment.status = 'finalizada';
        appointment.comments = `${appointment.comments} \n Estatus: finalizada ${formatISO(new Date())}`
      }
      const updatedAppointment = await this.appointmentRepository.save(appointment);
      return this.getAppointment(updatedAppointment);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  rescheduleAppointmentDentist = async ({ id, date, time, branchName }: RescheduleAppointmentDTO): Promise<GetAppointmentDetailDTO> => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(id) });
      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchName });

      appointment.appointment = date.toString().split("T")[0];
      appointment.time = time.simpleTime;
      appointment.branchId = branchOffice.id;
      appointment.branchName = branchOffice.name;
      appointment.status = 'activa';
      appointment.dentistId = null;
      appointment.receptionistId = null;
      appointment.comments = `${appointment.comments} \n Cita reagendada de ${appointment.appointment} ${appointment.time} para ${date.toString().split("T")[0]} ${time}`
      const updatedAppointment = await this.appointmentRepository.save(appointment);

      const response = await this.getAppointment(updatedAppointment);
      if (response.patient?.email != null || response.prospect?.email != null) {
        const name = response.prospect?.name ?? `${response.patient?.name} ${response.patient?.lastname} ${response.patient?.secondLastname}`;
        const email = response.prospect?.email ?? response.patient?.email;
        await this.emailService.sendAppointmentRescheduleEmail(
          new AppointmentTemplateMail(
            name,
            `${appointment.appointment} ${appointment.time}`,
            `${branchOffice.street} ${branchOffice.number} ${branchOffice.colony}, ${branchOffice.cp}`,
            `${branchOffice.name}`,
            `${branchOffice.primaryContact}`,
            `${appointment.folio}`,
            `${response.prospect?.primaryContact ?? response.patient?.primaryContact}`,
          ),
          email
        );
      }

      return response;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  private getAppointment = async (appointment: AppointmentEntity): Promise<GetAppointmentDetailDTO> => {
    const branchOffice = await this.branchOfficeRepository.findOneBy({ id: appointment.branchId });

    let prospect: ProspectEntity;
    let patient: PatientEntity;
    let dentist: EmployeeEntity;

    if (appointment.patientId == null || appointment.patientId == undefined) {
      prospect = await this.prospectRepository.findOneBy({ id: appointment.prospectId });
    } else {
      patient = await this.patientRepository.findOneBy({ id: appointment.patientId });
    }

    if (appointment.dentistId != null && appointment.dentistId != undefined) {
      dentist = await this.employeeRepository.findOneBy({ id: appointment.dentistId });
    }
    return new GetAppointmentDetailDTO(appointment, branchOffice, patient, prospect, dentist);
  }
}
