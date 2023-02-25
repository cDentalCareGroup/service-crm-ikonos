import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { MovementsTypeEntity } from './models/movements.type.entity';
import { PaymentEntity } from './models/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentDetailEntity } from './payment.detail.entity';
import { PaymentService } from './payment.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PaymentEntity, AppointmentEntity, PaymentDetailEntity, MovementsTypeEntity]),],
    providers: [PaymentService],
    controllers: [PaymentController]
})
export class PaymentModule {}
