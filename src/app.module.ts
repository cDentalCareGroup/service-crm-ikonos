import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import typeOrmConfig from './config/type.orm.config';
import { ConfigModule } from '@nestjs/config';
import { BranchOfficeModule } from './modules/branch_office/branch.office.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskServiceService } from './task-service/task-service.service';
import { PatientModule } from './modules/patient/patient.module';
import { HttpModule } from '@nestjs/axios';
import { CallsModule } from './modules/calls/calls.module';
import { PadModule } from './modules/pad/pad.module';
import { ServicesModule } from './modules/services/services.module';
import { ProspectModule } from './modules/prospect/prospect.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OriginsModule } from './modules/origins/origins.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { FirebaseModule } from './firebase/firebase.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmConfig,
    AuthModule,
    ScheduleModule.forRoot(),
    PatientModule,
    BranchOfficeModule,
    EmployeeModule,
    StatisticModule,
    AppointmentModule,
    HttpModule,
    CallsModule,
    PadModule,
    ServicesModule,
    ProspectModule,
    PaymentModule,
    OriginsModule,
    OrganizationModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskServiceService],
})
export class AppModule {}


