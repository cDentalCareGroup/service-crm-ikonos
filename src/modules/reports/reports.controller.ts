import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBody } from '@nestjs/swagger';
import { DatesDTO } from './models/reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('patientsDates')
  @ApiBody({ type: DatesDTO })
  async findPatientsBetweenDates(@Body() dates: DatesDTO): Promise<Report[]> {
    console.log('Received dates:', dates);
    return this.reportsService.findBetweenDates(
      dates.startedAt,
      dates.finishedAt,
    );
  }
}
