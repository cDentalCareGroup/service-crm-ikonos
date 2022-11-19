import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Patient } from './models/patient.entity';
import { PatientService } from './patient.service';

@ApiTags('Patients')
@Controller('patient')
export class PatientController {

    // constructor(private patientService: PatientService) {}

    // @Post('filters')
    // async filters(@Body() body: any): Promise<Patient[]> {
    //     return this.patientService.getPatientsByFilter(body.branch_name);
    // }
}
