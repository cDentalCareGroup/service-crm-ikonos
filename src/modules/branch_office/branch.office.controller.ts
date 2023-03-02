import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BranchOfficeService } from './branch.office.service';
import { BranchOfficeSchedulesByIdDTO, BranchOfficeSchedulesDTO, DeleteBranchOfficeScheduleDTO, GetBranchOfficeScheduleDTO, RegisterBranchOfficeScheduleDTO, UpdateAvailableTimeStatusDTO } from './models/branch.office.dto';
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
    @ApiBody({type: BranchOfficeSchedulesDTO})
    async getBranchOfficeSchedules(@Body() body: BranchOfficeSchedulesDTO): Promise<GetBranchOfficeScheduleDTO> {
        return this.branchOffice.getBranchOfficeSchedules(body);
    }

    @Post('schedules/employees')
    @ApiBody({type: BranchOfficeSchedulesByIdDTO})
    async getBranchOfficeSchedulesEmployees(@Body() body: BranchOfficeSchedulesByIdDTO): Promise<any> {
        return this.branchOffice.getBranchOfficeSchedulesEmployees(body);
    }

    @Post('schedules/id')
    @ApiBody({type: BranchOfficeSchedulesByIdDTO})
    async getBranchOfficeSchedulesById(@Body() body: BranchOfficeSchedulesByIdDTO): Promise<GetBranchOfficeScheduleDTO> {
        return this.branchOffice.getBranchOfficeSchedulesById(body);
    }

    @Get('schedule/employees')
    async getEmployeesSchedules(): Promise<any> {
        return this.branchOffice.getEmployeesSchedules();
    }    

    @Post('delete/schedule')
    @ApiBody({type: DeleteBranchOfficeScheduleDTO})
    async deleteBranchOfficeSchedule(@Body() body: DeleteBranchOfficeScheduleDTO): Promise<any> {
        return this.branchOffice.deleteBranchOfficeSchedule(body);
    }


    @Post('schedule/status') 
    @ApiBody({type: UpdateAvailableTimeStatusDTO})
    async updateScheduleStatus(@Body() body: UpdateAvailableTimeStatusDTO) {
        return this.branchOffice.updateScheduleStatus(body);
    }


}
