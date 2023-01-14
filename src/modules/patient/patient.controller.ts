import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetPatientsByFilter } from './models/get.patients.by.filter';
import { GetPatientByIdDTO, GetPatientsByBranchOfficeDTO, GetPatientsByFilterDTO, RegisterPatientDTO, UpdatePatientDTO, UpdatePatientStatus } from './models/patient.dto';
import { PatientEntity } from './models/patient.entity';
import { GetColoniesDTO, PatientService } from './patient.service';

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
    async getPatientsByFilter(@Body() body: GetPatientsByFilterDTO): Promise<PatientEntity[]> {
        return this.patientService.getPatientsByFilter(body);
    }

    @Post('register')
    @ApiBody({ type: RegisterPatientDTO })
    async registerPatient(@Body() body: RegisterPatientDTO): Promise<any> {
        return this.patientService.registerPatient(body);
    }

    @Post('update')
    @ApiBody({ type: UpdatePatientDTO })
    async updatePatient(@Body() body: UpdatePatientDTO): Promise<any> {
        return this.patientService.updatePatient(body);
    }

    @Get('origins')
    async getPatientOrigins(): Promise<any> {
        return this.patientService.getPatientsOrigin();
    }

    @Post('update/status')
    @ApiBody({ type: UpdatePatientStatus })
    async updatePatientstatus(@Body() body: UpdatePatientStatus): Promise<any> {
        return this.patientService.updatePatientStatus(body);
    }

    @Post('id')
    @ApiBody({ type: GetPatientByIdDTO })
    async getPatientById(@Body() body: GetPatientByIdDTO): Promise<PatientEntity> {
        return this.patientService.getPatientById(body);
    }


    @Post('colonies')
    @ApiBody({ type: GetColoniesDTO })
    async getColoniesFromPostalCode (@Body() body: GetColoniesDTO) {
        return this.patientService.getColoniesFromPostalCode(body);
    }

}
