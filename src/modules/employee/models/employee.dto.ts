import { ApiProperty } from "@nestjs/swagger";
import { setFullDate } from "src/modules/branch_office/models/branch.office.dto";
import { BranchOfficeEntity } from "src/modules/branch_office/models/branch.office.entity";
import { BranchOfficeScheduleEntity } from "src/modules/branch_office/models/branch.office.schedule.entity";
import { EmployeeEntity } from "./employee.entity";

export class GetEmployeesByTypeDTO {
  @ApiProperty({
    description: 'type name',
    example: 'Socio | Director general | Gerente administrativo | Gerente de comercialización | Jefe de recursos humanos | Jefe de finanzas | Contabilidad | Compras | Director de clínica | Recepcionista | Médico | Asistente médico | Mantenimiento | Coordinadora de recepciones | Especialista',
  })
  type: string;
}
export class RegisterScheduleesEmployeesDTO {
  @ApiProperty({
    description: 'data',
    example: 'array of schedules see RegisterScheduleeEmployeeDTO',
  })
  data: RegisterScheduleeEmployeeDTO[];
}

export class RegisterScheduleeEmployeeDTO {
  branchId: number;
  employeeId: number;
  scheduleId: number;

  constructor(branchId: number,
    employeeId: number,
    scheduleId: number) {
    this.branchId = branchId;
    this.employeeId = employeeId;
    this.scheduleId = scheduleId;
  }
}


export class DeleteEmployeeScheduleDTO {
  @ApiProperty({
    description: 'schedule id',
    example: '1,2',
  })
  scheduleId: number | string;
}


export class SchedulesEmployeeDTO {
  employee: EmployeeEntity;
  info: ScheduleBranchOfficeInfoDTO[];

  constructor(employee: EmployeeEntity,
    info: ScheduleBranchOfficeInfoDTO[]) {
    this.employee = employee;
    this.info = info;
  }

}
export class ScheduleBranchOfficeInfoDTO {
  branchOffice: BranchOfficeEntity;
  schedules: BranchOfficeScheduleEntity[];

  constructor(
    branchOffice: BranchOfficeEntity,
    schedules: BranchOfficeScheduleEntity[]) {
    this.branchOffice = branchOffice;
    this.schedules = schedules.map((value, _) => setFullDate(value));
  }
}

export class GetEmployeesByScheduleDTO {
  @ApiProperty({
    description: 'data',
    example: 'array of schedules see RegisterScheduleeEmployeeDTO',
  })
  id: string;
}