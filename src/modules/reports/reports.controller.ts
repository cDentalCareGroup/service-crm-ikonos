import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBody } from '@nestjs/swagger';
import { GetPatientAppointmentsReportsDTO } from './models/reports.dto';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('patientsDates')
  @ApiBody({ type: GetPatientAppointmentsReportsDTO })
  async findPatientsBetweenDates(@Body() dates: GetPatientAppointmentsReportsDTO): Promise<Report[]> {
    return this.reportsService.findBetweenDates(dates);
  }
}

