import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeEmployeeSchedule } from '../branch_office/models/branch.office.employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from './models/employee.entity';
import { EmployeeRoleEntity } from './models/employee.rol.entity';
import { EmployeeTypeEntity } from './models/employee.type.entity';
import { RolEntity } from '../auth/models/entities/rol.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([EmployeeEntity, EmployeeTypeEntity,BranchOfficeEmployeeSchedule, EmployeeRoleEntity, RolEntity, BranchOfficeEntity]),
      ],
      controllers: [EmployeeController],
      providers: [EmployeeService],
})
export class EmployeeModule {}
