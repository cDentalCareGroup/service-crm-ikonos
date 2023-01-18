import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { DeleteEmployeeScheduleDTO, GetEmployeeById, GetEmployeesByScheduleDTO, GetEmployeesByTypeDTO, RegisterEmployeeDTO, RegisterScheduleesEmployeesDTO, UpdateEmployeeDTO } from './models/employee.dto';

@ApiTags('Employees')
@Controller('employee')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}



    @Get('all')
    async getAllEmployees() {
        return this.employeeService.getAllEmployees();
    }

    @Get('all/info')
    async getAllEmployeesInfo() {
        return this.employeeService.getAllEmployeesInfo();
    }

    @Post('byType')
    @ApiBody({ type: GetEmployeesByTypeDTO })
    async getEmployeesByType(@Body() body: GetEmployeesByTypeDTO) {
        return this.employeeService.getEmployeesByType(body);
    }

    @Post('id')
    @ApiBody({ type: GetEmployeeById })
    async getEmployeeById(@Body() body: GetEmployeeById) {
        return this.employeeService.getEmployeeInfoById(body);
    }

    @Get('getTypes')
    async getEmployeeTypes() {
        return this.employeeService.getEmployeeTypes();
    }

    @Get('roles')
    async getEmployeeRoles() {
        return this.employeeService.getEmployeeRoles();
    }

    @Post('schedules')
    @ApiBody({ type: RegisterScheduleesEmployeesDTO })
    async registerEmployeeSchedules(@Body() body: RegisterScheduleesEmployeesDTO) {
        return this.employeeService.registerEmployeeSchedules(body);
    }

    @Post('delete/schedule')
    @ApiBody({type: DeleteEmployeeScheduleDTO})
    async deleteEmployeeSchedule(@Body() body: DeleteEmployeeScheduleDTO): Promise<any> {
        return this.employeeService.deleteEmployeeSchedule(body);
    }

    @Post('schedule')
    @ApiBody({ type: GetEmployeesByScheduleDTO })
    async getEmployeesBySchedule(@Body() body: GetEmployeesByScheduleDTO) {
        return this.employeeService.getEmployeesBySchedule(body);
    }

    @Post('branchoffice')
    @ApiBody({ type: GetEmployeesByScheduleDTO })
    async getEmployeesByBranchOffice(@Body() body: GetEmployeesByScheduleDTO) {
        return this.employeeService.getEmployeesByBranchOffice(body);
    }

    @Post('register')
    @ApiBody({ type: RegisterEmployeeDTO })
    async registerEmployee(@Body() body: RegisterEmployeeDTO) {
        return this.employeeService.registerEmployee(body);
    }

    @Post('update')
    @ApiBody({ type: UpdateEmployeeDTO })
    async updateEmployee(@Body() body: UpdateEmployeeDTO) {
        return this.employeeService.updateEmployee(body);
    }
}
