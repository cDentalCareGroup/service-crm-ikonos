import { ApiProperty } from "@nestjs/swagger";

export class GetEmployeesByTypeDTO {
    @ApiProperty({
      description: 'type name',
      example: 'Socio | Director general | Gerente administrativo | Gerente de comercialización | Jefe de recursos humanos | Jefe de finanzas | Contabilidad | Compras | Director de clínica | Recepcionista | Médico | Asistente médico | Mantenimiento | Coordinadora de recepciones | Especialista',
    })
    type: string ;
  }


  export class RegisterScheduleesEmployeesDTO {
    @ApiProperty({
      description: 'data',
      example: 'array of schedules see RegisterScheduleeEmployeeDTO',
    })
    data: RegisterScheduleeEmployeeDTO[];
}

export class RegisterScheduleeEmployeeDTO{
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