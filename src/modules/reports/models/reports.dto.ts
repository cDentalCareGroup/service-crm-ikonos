import { ApiProperty } from "@nestjs/swagger";
export class GetPatientAppointmentsReportDTO {
    @ApiProperty({
        description: 'The start date of the date range',
        example: '2023-01-01'
    })
    startedAt: string;

    @ApiProperty({
        description: 'The end date of the date range',
        example: '2023-01-03'
    })
    finishedAt: string;
}
export class GetPatientAppointmentsReportsDTO {
  startedAt: string;
  finishedAt: string;
}
