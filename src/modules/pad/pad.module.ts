import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PadCatalogueEntity } from './models/pad.catalogue.entity';
import { PadController } from './pad.controller';
import { PadService } from './pad.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PadCatalogueEntity]),],
    providers: [PadService],
    controllers: [PadController]
})
export class PadModule { }
