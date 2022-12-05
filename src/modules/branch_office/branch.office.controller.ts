import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BranchOfficeService } from './branch.office.service';
import { GetBranchOfficeScheduleDTO, RegisterBranchOfficeScheduleDTO } from './models/branch.office.dto';
import { BranchOfficeEntity } from './models/branch.office.entity';

@ApiTags('Branch Office')
@Controller('branchoffice')
export class BranchOfficeController {
    constructor(private branchOffice: BranchOfficeService) {}


    @Get('all')
    async getAllBranchOffices(): Promise<BranchOfficeEntity[]> {
        return this.branchOffice.getAllBranchOffices();
    }

    @Get('all/schedules')
    async getScheduleBranchOffices(): Promise<GetBranchOfficeScheduleDTO[]> {
        return this.branchOffice.getScheduleBranchOffices();
    }


    @Post('register/schedule')
    @ApiBody({ type: RegisterBranchOfficeScheduleDTO })
    async registerBranchOfficeSchedule(@Body() body: RegisterBranchOfficeScheduleDTO): Promise<GetBranchOfficeScheduleDTO> {
        return this.branchOffice.registerBranchOfficeSchedule(body);
    }

    @Post('schedules')
    async getBranchOfficeSchedules(@Body() body: RegisterBranchOfficeScheduleDTO): Promise<GetBranchOfficeScheduleDTO> {
        return this.branchOffice.getBranchOfficeSchedules();
    }

    @Get('schedule/employees')
    async getEmployeeSchedules(): Promise<any> {
        return this.branchOffice.getEmployeeSchedules();
    }


}
