import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { AppointmentService } from './appointment.service';
import { AppointmentAvailabilityDTO, AppointmentAvailbilityByDentistDTO, AppointmentDetailDTO, AvailableHoursDTO, CancelAppointmentDTO, GetAppointmentDetailDTO, GetAppointmentsByBranchOfficeDTO, GetNextAppointmentDetailDTO, RegiserAppointmentPatientDTO, RegisterAppointmentDentistDTO, RegisterAppointmentDTO, RegisterCallCenterAppointmentDTO, RegisterExtendAppointmentDTO, RegisterNextAppointmentDTO, RescheduleAppointmentDTO, SendNotificationDTO, SendWhatsappConfirmationDTO, UpdateAppointmentStatusDTO, UpdateHasCabinetAppointmentDTO, UpdateHasLabsAppointmentDTO } from './models/appointment.dto';

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

    @Post('register/callcenter')
    @ApiBody({ type: RegisterCallCenterAppointmentDTO })
    async registerCallCenterAppointment(@Body() body: RegisterCallCenterAppointmentDTO): Promise<string> {
        return this.appointmentService.registerAppointmentCallCenter(body);
    }

    @Post('detail')
    @ApiBody({ type: AppointmentDetailDTO })
    async getAppointmentDetail(@Body() body: AppointmentDetailDTO): Promise<GetNextAppointmentDetailDTO> {
        return this.appointmentService.getAppointmentDetail(body);
    }

    @Post('detail/patient')
    @ApiBody({ type: AppointmentDetailDTO })
    async getAppointmentDetailPatienti(@Body() body: AppointmentDetailDTO): Promise<GetAppointmentDetailDTO> {
        return this.appointmentService.getAppointmentDetailPatient(body);
    }

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
    @ApiBody({ type: RegisterNextAppointmentDTO })
    async registerNextAppointment(@Body() body: RegisterNextAppointmentDTO) {
        return this.appointmentService.registerNextAppointment(body);
    }

    @Post('update/haslabs')
    @ApiBody({ type: UpdateHasLabsAppointmentDTO })
    async updateHasLabs(@Body() body: UpdateHasLabsAppointmentDTO) {
        return this.appointmentService.updateHasLabs(body);
    }

    @Post('update/hasCabinet')
    @ApiBody({ type: UpdateHasCabinetAppointmentDTO })
    async updateHasCabinet(@Body() body: UpdateHasCabinetAppointmentDTO) {
        return this.appointmentService.updateHasCabinet(body);
    }

    @Post('notification')
    @ApiBody({ type: SendNotificationDTO })
    async sendAppointmentNotification(@Body() body: SendNotificationDTO) {
        return this.appointmentService.sendAppointmentNotification(body);
    }

    // @Post('webhooks')
    // async hook(@Body() body: any) {
    //     return this.appointmentService.processWhatsappMessages(body);
    // }

    // @Post('webhooks')
    // async post(@Body() body: any) {
    //     console.log(body);
    //     return this.appointmentService.processWhatsappMessages(body);
    // }

    @Get('services')
    async getServices() {
        return this.appointmentService.getServices();
    }
    @Get('paymentmethods')
    async getPaymentMethods() {
        return this.appointmentService.getPaymentMethods();
    }

    @Post('extend')
    @ApiBody({ type: RegisterExtendAppointmentDTO })
    async extendAppointment(@Body() body: RegisterExtendAppointmentDTO) {
        return this.appointmentService.extendAppointment(body);
    }

    @Post('whatsapp/confirmation')
    @ApiBody({ type: SendWhatsappConfirmationDTO })
    async testWhatsappMessage(@Body() body: SendWhatsappConfirmationDTO) {
        return this.appointmentService.testWhatsappMessage(body);
    }


    @Post('patient')
    async getAppointmentByPatient(@Body() body: any) {
        return this.appointmentService.getAppointmentByPatient(body);
    }


    @Post('register/patient')
    @ApiBody({ type: RegiserAppointmentPatientDTO })
    async registerAppointmentPatient(@Body() body: RegiserAppointmentPatientDTO) {
        return this.appointmentService.registerAppointmentPatient(body);
    }

    @Post('update/notattended')
    async updateNotShowAppointmentStatus(@Body() body: any) {
        console.log('aqi');
        return this.appointmentService.updateNotShowAppointmentStatus(body);
    }


    @Get('test/message')
    async testWhatsapp() {
        return this.appointmentService.testWhatsapp();
    }


    @Post('history')
    async getAppointmentsHistoryByPatient(@Body() body: any) {
        return this.appointmentService.getAppointmentsHistoryByPatient(body);
    }
}
