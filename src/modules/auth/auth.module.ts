import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { User } from './models/entities/user.entity';
import { Patient } from '../patient/models/patient.entity';
import { Appointments } from '../appointment/models/appointment.entity';
import { BranchOffice } from '../branch_office/models/branch.office.entity';
import { EmailController } from '../email/email.controller';
import { Employees } from '../employee/models/employee.entity';
import { Promotions } from '../promotion/models/promotion.entity';
import { Calls } from '../calls/models/calls.entity';
import { Rol } from './models/entities/rol.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User,Rol]),
    JwtModule.register({
      secret: process.env.CRM_TOKEN_SECRET,
      signOptions: { expiresIn: '18h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
