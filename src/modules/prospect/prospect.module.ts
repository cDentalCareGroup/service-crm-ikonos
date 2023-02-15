import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectEntity } from '../appointment/models/prospect.entity';
import { ProspectController } from './prospect.controller';
import { ProspectService } from './prospect.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ProspectEntity]),],
    providers: [ProspectService],
    controllers: [ProspectController]
})
export class ProspectModule { }
