import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { AppointmentService } from './appointment.service';
import { AppointmentAvailabilityDTO, AppointmentDetailDTO, AvailableHoursDTO, GetAppointmentDetailDTO, RegisterAppointmentRequestDTO } from './models/appointment.dto';

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
        return this.appointmentService.registerAppointment(body);
    }

    @Post('detail')
    @ApiBody({type: AppointmentDetailDTO})
    async getAppointmentDetail(@Body() body: AppointmentDetailDTO): Promise<GetAppointmentDetailDTO> {
        return this.appointmentService.getAppointmentDetail(body);
    }

}
