import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { ServiceCategoryEntity } from './models/service.category.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ServiceEntity,ServiceCategoryEntity]),],
    providers: [ServicesService],
    controllers: [ServicesController]
})
export class ServicesModule {}
