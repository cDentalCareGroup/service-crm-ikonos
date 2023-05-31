import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from '../appointment/appointment.module';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { MovementsTypeEntity } from './models/movements.type.entity';
import { PaymentEntity } from './models/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentDetailEntity } from './payment.detail.entity';
import { PaymentService } from './payment.service';
import { AccountPayableEntity } from './models/account.payable.entity';
import { AccountPayableDetailEntity } from './models/account.payable.detail.entity';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PaymentEntity, AppointmentEntity, PaymentDetailEntity, MovementsTypeEntity,AccountPayableEntity, AccountPayableDetailEntity]),
        AppointmentModule
    ],
    providers: [PaymentService],
    controllers: [PaymentController]
})
export class PaymentModule { }
