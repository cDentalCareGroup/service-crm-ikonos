import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from 'src/modules/appointment/appointment.service';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class TaskServiceService {


  constructor(private appointmentService: AppointmentService) { }

  @Cron('0 30 11 * * 0-6')
  async handleRemiderAppointment() {
    console.log(`Executing job handleRemiderAppointmentat ${new Date()}`);
    const data = await this.appointmentService.appointmentReminders();
    console.log(`Failure emails ${data}`);
  }

  @Cron('0 30 21 * * 0-6')
  async handleRemiderNotAttendedAppointment() {
    console.log(`Executing job handleRemiderNotAttendedAppointment at ${new Date()}`);
    const data = await this.appointmentService.appointmentNotAttended();
    console.log(`Failure emails ${data}`);
  }


  @Cron('0 30 5 * * 0-6')
  async handleReminderPad() {
    console.log(`Executing job handleReminderPad at ${new Date()}`);
    await this.appointmentService.reminderPad();
  }
}
