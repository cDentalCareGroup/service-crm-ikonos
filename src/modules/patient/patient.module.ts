import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { PadCatalogueEntity } from '../pad/models/pad.catalogue.entity';
import { PadComponenEntity } from '../pad/models/pad.component.entity';
import { PadEntity } from '../pad/models/pad.entity';
import { PadMemberEntity } from '../pad/models/pad.member.entity';
import { PatientEntity } from './models/patient.entity';
import { PatientOrganizationEntity } from './models/patient.organization.entity';
import { PatientOriginEntity } from './models/patient.origin.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
    imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forFeature([
        PatientEntity, 
        BranchOfficeEntity,
        PatientOriginEntity, 
        PatientOrganizationEntity,
        PadEntity,
        PadMemberEntity,
        PadCatalogueEntity,
        ServiceEntity,
        PadComponenEntity
      ]),
      HttpModule,
    ],
    controllers: [PatientController],
    providers: [PatientService],
  })
export class PatientModule {}
