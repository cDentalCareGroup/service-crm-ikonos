import { ApiProperty } from "@nestjs/swagger";
import { BranchOfficeEntity } from "src/modules/branch_office/models/branch.office.entity";
import { BranchOfficeScheduleEntity } from "src/modules/branch_office/models/branch.office.schedule.entity";
import { EmployeeEntity } from "src/modules/employee/models/employee.entity";
import { PatientEntity } from "src/modules/patient/models/patient.entity";
import { AppointmentEntity } from "./appointment.entity";
import { ProspectEntity } from "./prospect.entity";
import { ServiceEntity } from "./service.entity";

export class AvailableHoursDTO {
  id: number;
  time: string;
  simpleTime: string;
  seat: number;
  scheduleBranchOfficeId: number;
  constructor(id: number, time: string, simpleTime: string, seat: number, scheduleBranchOfficeId: number) {
    this.id = id;
    this.time = time;
    this.simpleTime = simpleTime;
    this.seat = seat;
    this.scheduleBranchOfficeId = scheduleBranchOfficeId;
  }
}

export class AppointmentAvailabilityDTO {
  @ApiProperty({
    description: 'name of the branch office',
    example: 'Las palmas',
  })
  branchOfficeName: string;
  @ApiProperty({
    description: 'name of day',
    example: 'Lunes, martes',
  })
  dayName: string;

  @ApiProperty({
    description: 'name of day',
    example: 'Lunes, martes',
  })
  date: string;
}

export class RegisterAppointmentDTO {
  name?: string;
  phone?: string;
  date?: Date;
  time?: AvailableHoursDTO;
  email?: string;
  branchName?: string;
  constructor(
    name?: string,
    phone?: string,
    date?: Date, time?: AvailableHoursDTO, email?: string, branchName?: string,) {
    this.time = time;
    this.name = name;
    this.phone = phone;
    this.date = date;
    this.email = email;
    this.branchName = branchName;
  }
}

export class GetAppointmentDetailDTO {
  appointment: AppointmentEntity;
  branchOffice: BranchOfficeEntity;
  patient?: PatientEntity;
  prospect?: ProspectEntity;
  dentist?: EmployeeEntity;
  services?: ServiceEntity[];

  constructor(appointment: AppointmentEntity,
    branchOffice: BranchOfficeEntity,
    patient?: PatientEntity,
    prospect?: ProspectEntity, dentist?: EmployeeEntity, services?: ServiceEntity[]) {
    this.appointment = appointment;
    this.branchOffice = branchOffice;
    this.patient = patient;
    this.prospect = prospect;
    this.dentist = dentist;
    this.services = services;
  }
}

export class GetNextAppointmentDetailDTO {
  appointment: GetAppointmentDetailDTO;
  nextAppointments?: GetAppointmentDetailDTO[];

  constructor(appointment: GetAppointmentDetailDTO, nextAppointments?: GetAppointmentDetailDTO[]) {
    this.appointment = appointment;
    this.nextAppointments = nextAppointments;
  }
}

export class AppointmentDetailDTO {
  folio: string;
}

export class GetAppointmentsByBranchOfficeDTO {
  id: string | number;
  status?: string;
}


export class GetAppointmentsByBranchOfficeStatusDTO {
  id: string | number;
  status: string;
}

export class RegisterAppointmentDentistDTO {
  id: string | number;
  appointmentId: string | number;
  username: string;
  patientId: string;
}

export class UpdateAppointmentStatusDTO {
  id: string | number;
  status: string;
  date: string;
  amount: string;
  paymentMethod: number;
  servicesId: number[];
}


export class RescheduleAppointmentDTO {
  id: number | string;
  date?: Date;
  time?: AvailableHoursDTO;
  branchName?: string;
}


export class CancelAppointmentDTO {
  folio: string;
  reason: string;
}


export class AppointmentAvailbilityByDentistDTO {
  dentistId: string;
  dayname: string;
  branchOfficeId: string;
  date: string;
}

export class RegisterNextAppointmentDTO {
  date?: Date;
  time?: AvailableHoursDTO;
  patientId: number;
  branchOfficeId: string;
  dentistId: string;
  hasLabs: number;
  hasCabinet: number;
  services: number[];
}

export class UpdateHasLabsAppointmentDTO {
  id: number;
  hasLabs: number;
}

export class UpdateHasCabinetAppointmentDTO {
  id: number;
  hasCabinet: number;
}

export class SendNotificationDTO {
  folio: string;
}