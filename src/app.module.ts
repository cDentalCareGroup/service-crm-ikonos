import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import typeOrmConfig from './config/type.orm.config';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mail } from './utils/mail.utils';
import { EmailController } from './modules/email/email.controller';
import { PatientModule } from './modules/patient/patient.module';
import { BranchOfficeModule } from './modules/branch_office/branch.office.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { AppointmentController } from './modules/appointment/appointment.controller';
import { AppointmentService } from './modules/appointment/appointment.service';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { EmailService } from './modules/email/email.service';
import { EmailModule } from './modules/email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskServiceService } from './task-service/task-service.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmConfig,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: mail.host,
        port: mail.port,
        secure: true,
        auth: {
          user: mail.auth.user,
          pass: mail.auth.pass
        }
      }
    }),
    ScheduleModule.forRoot(),
    PatientModule,
    BranchOfficeModule,
    EmployeeModule,
    StatisticModule,
    AppointmentModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskServiceService],
})
export class AppModule {}


