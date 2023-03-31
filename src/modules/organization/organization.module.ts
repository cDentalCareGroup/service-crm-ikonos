import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from './models/organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
    imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([OrganizationEntity]),],
    providers: [OrganizationService],
    controllers: [OrganizationController]
})
export class OrganizationModule {}
