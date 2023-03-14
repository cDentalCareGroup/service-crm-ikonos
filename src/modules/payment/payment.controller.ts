import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterPaymentDTO } from './models/payment.dto';
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


    @Post('patient')
    async gatPatientPayments(@Body() body: any) {
        return this.paymentService.gatPatientPayments(body);
    }

    @Post('patient/register/movement')
    async registerPatientMovement(@Body() body: RegisterPaymentDTO) {
        return this.paymentService.registerPatientMovement(body);
    }
}
