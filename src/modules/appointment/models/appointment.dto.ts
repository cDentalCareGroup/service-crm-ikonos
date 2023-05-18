import { ApiProperty } from "@nestjs/swagger";
import { BranchOfficeEntity } from "src/modules/branch_office/models/branch.office.entity";
import { BranchOfficeScheduleEntity } from "src/modules/branch_office/models/branch.office.schedule.entity";
import { EmployeeEntity } from "src/modules/employee/models/employee.entity";
import { PatientEntity } from "src/modules/patient/models/patient.entity";
import { PaymentEntity } from "src/modules/payment/models/payment.entity";
import { AppointmentDetailEntity } from "./appointment.detail.entity";
import { AppointmentEntity } from "./appointment.entity";
import { AppointmentTimesEntity } from "./appointment.times.entity";
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

  filterHours?: boolean;
}

export class RegisterAppointmentDTO {
  name?: string;
  phone?: string;
  date?: Date;
  time?: AvailableHoursDTO;
  email?: string;
  branchName?: string;
  referal?: string;
  constructor(
    name?: string,
    phone?: string,
    date?: Date, time?: AvailableHoursDTO, email?: string, branchName?: string, referal?: string) {
    this.time = time;
    this.name = name;
    this.phone = phone;
    this.date = date;
    this.email = email;
    this.branchName = branchName;
    this.referal = referal;
  }
}

export class RegisterCallCenterAppointmentDTO {
  name?: string;
  phone?: string;
  date?: Date;
  time?: AvailableHoursDTO;
  email?: string;
  branchId?: number;
  patientId?: number;
  prospectId?: number;
  callId?: number;
  nofity?: boolean;
  isCallCenter?: boolean;
  comments?: string;
  blockCalendar?: boolean;
}

export class GetAppointmentDetailDTO {
  appointment: AppointmentEntity;
  branchOffice: BranchOfficeEntity;
  patient?: PatientEntity;
  prospect?: ProspectEntity;
  dentist?: EmployeeEntity;
  services?: ServiceEntity[];
  extendedTimes?: AppointmentTimesEntity[];

  constructor(appointment: AppointmentEntity,
    branchOffice: BranchOfficeEntity,
    patient?: PatientEntity,
    prospect?: ProspectEntity, dentist?: EmployeeEntity, services?: ServiceEntity[], extendedTimes?: AppointmentTimesEntity[]) {
    this.appointment = appointment;
    this.branchOffice = branchOffice;
    this.patient = patient;
    this.prospect = prospect;
    this.dentist = dentist;
    this.services = services;
    this.extendedTimes = extendedTimes;
  }
}

export class GetNextAppointmentDetailDTO {
  appointment: GetAppointmentDetailDTO;
  services: ServiceDetail[];

  constructor(appointment: GetAppointmentDetailDTO, services: ServiceDetail[]) {
    this.appointment = appointment;
    this.services = services;
  }
}

export class AppointmentDetailDTO {
  folio: string;
}

export class GetAppointmentsByBranchOfficeDTO {
  id: string | number;
  status?: string;
  date: string
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
  padId: number;
  amount: string;
  paid: string;
  services: any[];
  payments: any[];
  shouldAddAmount: boolean;
  deposits: PaymentEntity[]
  debts: PaymentEntity[];
}


export class RescheduleAppointmentDTO {
  id: number | string;
  date?: Date;
  time?: AvailableHoursDTO;
  branchName?: string;
  nofity?: boolean;
  comments?: string;
  blockCalendar?: boolean;
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
  nextAppointmentId: number;
  nofity?: boolean;
  comments?: string;
  blockCalendar?: boolean;
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


export class RegisterExtendAppointmentDTO {
  id: number;
  times: string[];
  appointment: string;
}

export class SendWhatsappConfirmationDTO {
  number: string;
  branchOffice: string;
  time: string;

  constructor(number: string,
    branchOffice: string,
    time: string) {
    this.number = number;
    this.branchOffice = branchOffice;
    this.time = time;
  }
}

export class SendWhatsappSimpleTextDTO {
  number: string;
  text: string;
  hideTitle?: boolean;
  constructor(number: string,
    text: string, hideTitle?: boolean) {
    this.number = number;
    this.text = text;
    this.hideTitle = hideTitle;
  }
}


export class RegiserAppointmentPatientDTO {
  appointmentId: number;
  patientId: number;
}



export class ServiceDetail {
  service: ServiceEntity;
  info: AppointmentDetailEntity;

  constructor(service: ServiceEntity,
    info: AppointmentDetailEntity) {
    this.service = service;
    this.info = info;
  }
}