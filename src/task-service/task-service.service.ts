import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from 'src/modules/appointment/appointment.service';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class TaskServiceService {


    constructor(private appointmentService: AppointmentService) {}



    // @Cron(CronExpression.EVERY_30_SECONDS,{name:'email-reminders'})
    // //0 0 6 * * 1-6
    async handleRemiderAppointment() {
        const data = await this.appointmentService.appointmentReminders();
        console.log(data);
    }
}
