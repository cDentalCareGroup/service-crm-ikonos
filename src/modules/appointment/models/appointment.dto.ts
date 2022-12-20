import { ApiProperty } from "@nestjs/swagger";
import { BranchOfficeEntity } from "src/modules/branch_office/models/branch.office.entity";
import { BranchOfficeScheduleEntity } from "src/modules/branch_office/models/branch.office.schedule.entity";
import { EmployeeEntity } from "src/modules/employee/models/employee.entity";
import { PatientEntity } from "src/modules/patient/models/patient.entity";
import { AppointmentEntity } from "./appointment.entity";
import { ProspectEntity } from "./prospect.entity";

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
  dentist?: EmployeeEntity

  constructor( appointment: AppointmentEntity,
    branchOffice: BranchOfficeEntity,
    patient?: PatientEntity,
    prospect?: ProspectEntity,dentist?: EmployeeEntity) {
      this.appointment = appointment;
      this.branchOffice = branchOffice;
      this.patient = patient;
      this.prospect = prospect;
      this.dentist = dentist;
  }
}

export class AppointmentDetailDTO {
  folio: string;
}

export class GetAppointmentsByBranchOfficeDTO {
  id: string | number;
}

export class RegisterAppointmentDentistDTO {
  id: string | number;
  appointmentId: string | number;
  username: string;
}

export class UpdateAppointmentStatusDTO {
  id: string | number;
  status: string;
  date: string;
  patientId?: string | number;
}


export class RescheduleAppointmentDTO {
  id: number | string;
  date?: Date;
  time?: AvailableHoursDTO;
  branchName?: string;
}