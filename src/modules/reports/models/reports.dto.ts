import { ApiProperty } from "@nestjs/swagger";
export class GetPatientAppointmentsReportDTO {
    @ApiProperty({
        description: 'La fecha de inicio del rango de fechas',
        example: '2023-01-01'
    })
    startedAt: string;

    @ApiProperty({
        description: 'La fecha de fin del rango de fechas',
        example: '2023-01-03'
    })
    finishedAt: string;
}
export class GetPatientAppointmentsReportsDTO {
  startedAt: string;
  finishedAt: string;
}
