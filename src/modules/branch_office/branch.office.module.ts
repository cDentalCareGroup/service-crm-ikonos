import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeController } from './branch.office.controller';
import { BranchOfficeService } from './branch.office.service';
import { BranchOffice } from './models/branch.office.entity';

@Module({
    imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([BranchOffice]),
  ],
  controllers: [BranchOfficeController],
  providers: [BranchOfficeService],
  exports: [BranchOfficeService]
})
export class BranchOfficeModule {}


