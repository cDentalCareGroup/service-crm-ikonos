import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from 'src/modules/appointment/appointment.service';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class TaskServiceService {


  constructor(private appointmentService: AppointmentService) { }

  // @Cron('0 30 11 * * 0-6')
  // async handleRemiderAppointment() {
  //   const date = new Date();
  //   date.setDate(date.getDate() + 1);
  //   const nextDate = date.toISOString().split("T")[0];
  //   console.log(`Executing job handleRemiderAppointmentat ${nextDate}`);
  //   const data = await this.appointmentService.appointmentReminders();
  //   console.log(`Whatsapps ${data}`);
  // }

  // @Cron('0 30 23 * * 0-6')
  // async handleRemiderNotAttendedAppointment() {
  //   const date = new Date();
  //   date.setDate(date.getDate() - 1);
  //   const nextDate = date.toISOString().split("T")[0];
  //   console.log(`Executing job handleRemiderNotAttendedAppointment at ${nextDate}`);
  //   const data = await this.appointmentService.appointmentNotAttended();
  //   console.log(`Generated calls -  ${JSON.stringify(data)}`);
  //   console.log(`Generated calls -  ${data}`);
  // }


  @Cron('0 30 9 * * 0-6')
  async handleReminderPad() {
    console.log(`Executing job handleReminderPad at ${new Date()}`);
    await this.appointmentService.reminderPad();
  }
}
