import { ApiProperty } from "@nestjs/swagger";

export class GetEmployeesByTypeDTO {
    @ApiProperty({
      description: 'type name',
      example: 'Socio | Director general | Gerente administrativo | Gerente de comercialización | Jefe de recursos humanos | Jefe de finanzas | Contabilidad | Compras | Director de clínica | Recepcionista | Médico | Asistente médico | Mantenimiento | Coordinadora de recepciones | Especialista',
    })
    type: string ;
  }