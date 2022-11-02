import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService){}


    @Get('testemail')
    async testEmail (){
        try {
            return await this.mailService.sendMail({
                to:'imanueld22@gmail.com',
                from: 'NareJoyasSupport@narejoyas.com',
                subject: 'Reset password',
                html:``
            });
        } catch (error) {
            console.log("error",error);
        }
    }
}
