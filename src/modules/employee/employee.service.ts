import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HandleException,
  NotFoundCustomException,
  NotFoundType,
  ValidationException,
  ValidationExceptionType,
} from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { DeleteBranchOfficeScheduleDTO } from '../branch_office/models/branch.office.dto';
import { BranchOfficeEmployeeSchedule } from '../branch_office/models/branch.office.employee.entity';
import { registerScheduleEmployeeToEntity } from './extensions/employee.extensions';
import { GetEmployeesByTypeDTO, RegisterScheduleesEmployeesDTO } from './models/employee.dto';
import { EmployeeEntity } from './models/employee.entity';
import { EmployeeTypeEntity } from './models/employee.type.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(EmployeeTypeEntity)
    private employeeTypeRepository: Repository<EmployeeTypeEntity>,
    @InjectRepository(BranchOfficeEmployeeSchedule) private branchOfficeEmployeeScheduleRepository: Repository<BranchOfficeEmployeeSchedule>,
  ) { }

  getAllEmployees = async (): Promise<EmployeeEntity[]> => {
    try {
      const results = await this.employeeRepository.find();
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  getEmployeesByType = async ({
    type,
  }: GetEmployeesByTypeDTO): Promise<EmployeeEntity[]> => {
    try {
      if (type == null || type == '')
        throw new ValidationException(ValidationExceptionType.MISSING_VALUES);


      if (type.includes('Medico/Especialista')) {
        const employeeTypeMedical = await this.employeeTypeRepository.findOneBy({
          name: 'Medico',
        });
        const employeeTypeSpecialist = await this.employeeTypeRepository.findOneBy({
          name: 'Especialista',
        });
        const results = await this.employeeRepository.find({
          where: [{ typeId: employeeTypeMedical.id }, { typeId: employeeTypeSpecialist.id }]
        });
        return results.map((value: EmployeeEntity,_) => {
          const item = value;
          item.typeName = employeeTypeMedical.id == value.typeId ? 'Medico': 'Especialista'
          return item
        })
      } else {
        const employeeType = await this.employeeTypeRepository.findOneBy({
          name: type,
        });
        if (employeeType != null) {
          const results = await this.employeeRepository.find({
            where: { typeId: employeeType.id },
          });
          return results;
        } else {
          throw new NotFoundCustomException(NotFoundType.EMPLOYEE_TYPE);
        }
      }

    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  getEmployeeTypes = async (): Promise<EmployeeTypeEntity[]> => {
    try {
      const results = await this.employeeTypeRepository.find();
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  registerEmployeeSchedules = async ({ data }: RegisterScheduleesEmployeesDTO) => {
    try {
      for await (const element of data) {
        const exists = await this.branchOfficeEmployeeScheduleRepository.findOneBy({ branchId: element.branchId, branchScheduleId: element.scheduleId, employeeId: element.employeeId });
        if (exists == null) {
          await this.branchOfficeEmployeeScheduleRepository.save(registerScheduleEmployeeToEntity(element));
        } else {
          console.log("Existing value", exists);
        }
      }
      return 200;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  deleteEmployeeSchedule = async ({ scheduleId }: DeleteBranchOfficeScheduleDTO): Promise<any> => {
    try {
      const schedule = await this.branchOfficeEmployeeScheduleRepository.delete({ id: Number(scheduleId) });
      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }
}
