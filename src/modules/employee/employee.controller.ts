import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { GetEmployeesByTypeDTO, RegisterScheduleesEmployeesDTO } from './models/employee.dto';

@ApiTags('Employees')
@Controller('employee')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}



    @Get('all')
    async getAllEmployees() {
        return this.employeeService.getAllEmployees();
    }

    @Post('byType')
    @ApiBody({ type: GetEmployeesByTypeDTO })
    async getEmployeesByType(@Body() body: GetEmployeesByTypeDTO) {
        return this.employeeService.getEmployeesByType(body);
    }

    @Get('getTypes')
    async getEmployeeTypes() {
        return this.employeeService.getEmployeeTypes();
    }

    @Post('schedules')
    @ApiBody({ type: RegisterScheduleesEmployeesDTO })
    async registerEmployeeSchedules(@Body() body: RegisterScheduleesEmployeesDTO) {
        return this.employeeService.registerEmployeeSchedules(body);
    }
}
