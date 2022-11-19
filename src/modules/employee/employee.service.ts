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
import { GetEmployeesByTypeDTO } from './models/employee.dto';
import { EmployeeEntity } from './models/employee.entity';
import { EmployeeTypeEntity } from './models/employee.type.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(EmployeeTypeEntity)
    private employeeTypeRepository: Repository<EmployeeTypeEntity>,
  ) {}

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
}
