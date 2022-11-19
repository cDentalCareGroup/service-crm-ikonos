import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetPatientsByBranchOfficeDTO } from './models/patient.dto';
import { Patient } from './models/patient.entity';
import { PatientService } from './patient.service';

@ApiTags('Patients')
@Controller('patient')
export class PatientController {

    constructor(private patientService: PatientService) {}

    @Get('all')
    async getAllPatients(): Promise<Patient[]> {
        return this.patientService.getAllPatients();
    }

    @Post('byBranchOffice')
    @ApiBody({ type: GetPatientsByBranchOfficeDTO })
    async getPatientsByBranchOffice(@Body() body: GetPatientsByBranchOfficeDTO): Promise<Patient[]> {
        return this.patientService.getPatientsByBranchOffice(body);
    }
}
