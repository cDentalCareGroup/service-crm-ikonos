import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { PadCatalogueEntity } from './models/pad.catalogue.entity';
import { PadComponenEntity } from './models/pad.component.entity';
import { PadController } from './pad.controller';
import { PadService } from './pad.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PadCatalogueEntity, PadComponenEntity,ServiceEntity]),],
    providers: [PadService],
    controllers: [PadController]
})
export class PadModule { }
