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
    PatientModule,
    BranchOfficeModule,
    EmployeeModule,
    StatisticModule,
    AppointmentModule
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
