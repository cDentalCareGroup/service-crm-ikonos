import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetPatientsByFilter } from './models/get.patients.by.filter';
import { GetPatientsByBranchOfficeDTO, GetPatientsByFilterDTO } from './models/patient.dto';
import { PatientEntity } from './models/patient.entity';
import { PatientService } from './patient.service';

@ApiTags('Patients')
@Controller('patient')
export class PatientController {

    constructor(private patientService: PatientService) {}

    @Get('all')
    async getAllPatients(): Promise<PatientEntity[]> {
        return this.patientService.getAllPatients();
    }

    @Post('byBranchOffice')
    @ApiBody({ type: GetPatientsByBranchOfficeDTO })
    async getPatientsByBranchOffice(@Body() body: GetPatientsByBranchOfficeDTO): Promise<PatientEntity[]> {
        return this.patientService.getPatientsByBranchOffice(body);
    }

    @Post('filter')
    @ApiBody({ type: GetPatientsByFilterDTO })
    async getPatientsByFilter(@Body() body: GetPatientsByFilterDTO): Promise<GetPatientsByFilter[]> {
        return this.patientService.getPatientsByFilter(body);
    }
}
