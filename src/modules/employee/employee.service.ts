import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
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
import { DeleteEmployeeScheduleDTO, GetEmployeesByScheduleDTO, GetEmployeesByTypeDTO, RegisterEmployeeDTO, RegisterScheduleesEmployeesDTO } from './models/employee.dto';
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
        return results.map((value: EmployeeEntity, _) => {
          const item = value;
          item.typeName = employeeTypeMedical.id == value.typeId ? 'Medico' : 'Especialista'
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
      console.log(exception);
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


  deleteEmployeeSchedule = async ({ scheduleId, dentistId }: DeleteEmployeeScheduleDTO): Promise<any> => {
    try {
      const schedule = await this.branchOfficeEmployeeScheduleRepository.delete({
        branchScheduleId: Number(scheduleId), employeeId: Number(dentistId)
      });
      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  getEmployeesBySchedule = async ({ id }: GetEmployeesByScheduleDTO) => {
    try {
      const schedules = await this.branchOfficeEmployeeScheduleRepository.findBy({ branchScheduleId: Number(id) });
      let employeesArray: string[] = [];
      for await (const schedule of schedules) {
        const employees = await this.employeeRepository.findBy({ id: schedule.employeeId });
        const res = employees.map((element, _) =>
          `${element.name} ${element.lastname} ${element.secondLastname}`
        );
        employeesArray.push(res.toString());
      }
      return employeesArray;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  getEmployeesByBranchOffice = async ({ id }: GetEmployeesByScheduleDTO): Promise<EmployeeEntity[]> => {
    try {
      const employees = await this.employeeRepository.findBy({ branchOfficeId: Number(id) });
      return employees;
    } catch (error) {
      HandleException.exception(error);
    }
  }


  registerEmployee = async (body: RegisterEmployeeDTO) => {
    try {
      const employee = new EmployeeEntity();
      employee.user = body.user;
      employee.password = body.password;
      employee.name = body.name;
      employee.lastname = body.lastname;
      employee.secondLastname = body.secondLastname;
      employee.street = body.street;
      employee.number = body.number;
      employee.colony = body.colony;
      employee.cp = body.cp;
      employee.state = body.state;
      employee.primaryContact = body.phone;
      employee.birthDay = new Date(body.brithday);
      employee.rfc = body.rfc;
      employee.nss = body.nss;
      employee.startDate = format(new Date(),'yyyy-MM-dd');
      employee.branchOfficeId = body.branchOfficeId;
      employee.status = body.status;
      employee.jobScheme = body.jobSchemeId;
      employee.typeId = body.typeId;
      employee.email = body.email;
      employee.gender = body.gender;
      return await this.employeeRepository.save(employee);

    } catch (error) {
      HandleException.exception(error);
    }
  }
}
