import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginEntity } from './models/origin.entity';
import { OriginsController } from './origins.controller';
import { OriginsService } from './origins.service';


@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([OriginEntity]),],
    providers: [OriginsService],
    controllers: [OriginsController]
})
export class OriginsModule { }
