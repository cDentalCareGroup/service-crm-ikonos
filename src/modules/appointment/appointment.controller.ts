import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { AppointmentService } from './appointment.service';
import { AppointmentAvailabilityDTO, AvailableHoursDTO, RegisterAppointmentRequestDTO } from './models/appointment.dto';

@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {}




    @Post('day/availability')
    @ApiBody({type: AppointmentAvailabilityDTO})
    async getAppointmentsAvailability(@Body() body: AppointmentAvailabilityDTO): Promise<AvailableHoursDTO[]> {
        return this.appointmentService.getAppointmentsAvailability(body);
    }

    @Post('register')
    @ApiBody({type: RegisterAppointmentRequestDTO})
    async registerAppointment(@Body() body: RegisterAppointmentRequestDTO): Promise<any> {
       // console.log(body);
        return this.appointmentService.registerAppointment(body);
    }

}
