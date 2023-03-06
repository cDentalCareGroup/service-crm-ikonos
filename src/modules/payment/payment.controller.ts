import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {


    constructor(private paymentService: PaymentService){}

    @Post('register')
    async registerPayment(@Body() body: any) {
        return this.paymentService.registerPayment(body);
    }

    @Get('types')
    async getPaymentTypes() {
        return this.paymentService.getTypes();
    }


    @Post('pending/patient')
    async getPendingAppointmentsByPatient(@Body() body: any) {
        return this.paymentService.getPendingAppointmentsByPatient(body);
    }
}
