import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { PadCatalogueEntity } from './models/pad.catalogue.entity';
import { PadComponenEntity } from './models/pad.component.entity';
import { PadComponentUsedEntity } from './models/pad.component.used.entity';
import { PadEntity } from './models/pad.entity';
import { PadMemberEntity } from './models/pad.member.entity';
import { PadController } from './pad.controller';
import { PadService } from './pad.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PadCatalogueEntity, PadComponenEntity,ServiceEntity, PadEntity, PatientEntity,PadMemberEntity, PadComponentUsedEntity]),],
    providers: [PadService],
    controllers: [PadController]
})
export class PadModule { }
