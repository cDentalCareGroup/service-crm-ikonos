import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { AppointmentService } from './appointment.service';
import { AppointmentAvailabilityDTO, AppointmentAvailbilityByDentistDTO, AppointmentDetailDTO, AvailableHoursDTO, CancelAppointmentDTO, GetAppointmentDetailDTO, GetAppointmentsByBranchOfficeDTO, RegisterAppointmentDentistDTO, RegisterAppointmentDTO, RegisterNextAppointmentDTO, RescheduleAppointmentDTO, UpdateAppointmentStatusDTO, UpdateHasLabsAppointmentDTO } from './models/appointment.dto';

@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) { }


    @Post('day/availability')
    @ApiBody({ type: AppointmentAvailabilityDTO })
    async getAppointmentsAvailability(@Body() body: AppointmentAvailabilityDTO): Promise<AvailableHoursDTO[]> {
        return this.appointmentService.getAppointmentsAvailability(body);
    }

    @Post('register')
    @ApiBody({ type: RegisterAppointmentDTO })
    async registerAppointment(@Body() body: RegisterAppointmentDTO): Promise<string> {
        return this.appointmentService.registerAppointment(body);
    }

    @Post('detail')
    @ApiBody({ type: AppointmentDetailDTO })
    async getAppointmentDetail(@Body() body: AppointmentDetailDTO): Promise<GetAppointmentDetailDTO> {
        return this.appointmentService.getAppointmentDetail(body);
    }

    // @Get('ttttt')
    // @ApiBody({type: AppointmentDetailDTO})
    // async tt(): Promise<any> {
    //     return this.appointmentService.appointmentReminders();
    // }

    @Post('branchoffice')
    @ApiBody({ type: GetAppointmentsByBranchOfficeDTO })
    async getAllAppointmentByBranchOffice(@Body() body: GetAppointmentsByBranchOfficeDTO): Promise<GetAppointmentDetailDTO[]> {
        return this.appointmentService.getAllAppointmentByBranchOffice(body);
    }

    @Post('register/dentist')
    @ApiBody({ type: RegisterAppointmentDentistDTO })
    async registerAppointmentDentist(@Body() body: RegisterAppointmentDentistDTO): Promise<GetAppointmentDetailDTO> {
        return this.appointmentService.registerAppointmentDentist(body);
    }

    @Post('update/status')
    @ApiBody({ type: UpdateAppointmentStatusDTO })
    async updateAppointmentStatus(@Body() body: UpdateAppointmentStatusDTO): Promise<GetAppointmentDetailDTO> {
        return this.appointmentService.updateAppointmentStatus(body);
    }

    @Post('reschedule')
    @ApiBody({ type: RescheduleAppointmentDTO })
    async rescheduleAppointment(@Body() body: RescheduleAppointmentDTO): Promise<GetAppointmentDetailDTO> {
        console.log(body);
        return this.appointmentService.rescheduleAppointmentDentist(body);
    }

    @Post('cancel')
    @ApiBody({ type: CancelAppointmentDTO })
    async cancelAppointment(@Body() body: CancelAppointmentDTO): Promise<any> {
       return this.appointmentService.cancelAppointment(body);
    }

    @Post('day/availability/dentist')
    @ApiBody({ type: AppointmentAvailbilityByDentistDTO })
    async getAppointmentAvailbilityByDentist(@Body() body: AppointmentAvailbilityByDentistDTO): Promise<AvailableHoursDTO[]> {
        return this.appointmentService.getAppointmentAvailbilityByDentist(body);
    }

    @Post('resgiter/nextappointment')
    @ApiBody({type: RegisterNextAppointmentDTO})
    async registerNextAppointment(@Body() body: any) {
        return this.appointmentService.registerNextAppointment(body);
    }

    @Post('update/haslabs')
    @ApiBody({type: UpdateHasLabsAppointmentDTO})
    async updateHasLabs(@Body() body: UpdateHasLabsAppointmentDTO) {
        return this.appointmentService.updateHasLabs(body);
    }
}
