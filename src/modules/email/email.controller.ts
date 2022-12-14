import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
    constructor(private mailService: EmailService){}


    @Get('testemail')
    async testEmail (){
        return 200;
    }
}
