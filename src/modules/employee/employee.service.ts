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
import { DeleteEmployeeScheduleDTO, GetEmployeeById, GetEmployeesByScheduleDTO, GetEmployeesByTypeDTO, RegisterEmployeeDTO, RegisterScheduleesEmployeesDTO, UpdateEmployeeDTO } from './models/employee.dto';
import { EmployeeEntity } from './models/employee.entity';
import { EmployeeTypeEntity } from './models/employee.type.entity';
import { SecurityUtil, } from 'src/utils/security.util';
import { EmployeeRoleEntity } from './models/employee.rol.entity';
import { RolEntity } from '../auth/models/entities/rol.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { capitalizeAllCharacters, capitalizeFirstLetter } from 'src/utils/general.functions.utils';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(EmployeeTypeEntity)
    private employeeTypeRepository: Repository<EmployeeTypeEntity>,
    @InjectRepository(EmployeeRoleEntity)
    private employeeRoleRepository: Repository<EmployeeRoleEntity>,
    @InjectRepository(BranchOfficeEmployeeSchedule) private branchOfficeEmployeeScheduleRepository: Repository<BranchOfficeEmployeeSchedule>,
    @InjectRepository(RolEntity) private roleRepository: Repository<RolEntity>,
    @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,

  ) { }

  getAllEmployees = async (): Promise<EmployeeEntity[]> => {
    try {
      const results = await this.employeeRepository.find();
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  getAllEmployeesInfo = async (): Promise<EmployeeEntity[]> => {
    try {
      const results = await this.employeeRepository.find({order:{id:'DESC'}});
      const data = [];
      for await (const employee of results) {
        const branchOffice = await this.branchOfficeRepository.findOneBy({ id: employee.branchOfficeId });
        data.push({
          'employee': employee,
          'branchOffice': branchOffice,
        })
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };

  getEmployeeInfoById = async ({ id }: GetEmployeeById): Promise<any> => {
    try {
      const employee = await this.employeeRepository.findOneBy({ id: Number(id) });
      const branchOffice = await this.branchOfficeRepository.findOneBy({ id: employee.branchOfficeId });
      return {
        'employee': employee,
        'branchOffice': branchOffice,
      };
    } catch (exception) {
      console.log(exception);
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

  getEmployeeRoles = async (): Promise<RolEntity[]> => {
    try {
      const results = await this.roleRepository.find();
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

      const pass = await SecurityUtil.encryptText(body.password);
      const employee = new EmployeeEntity();
      employee.user = body.user;
      employee.password = pass;
      employee.name = capitalizeAllCharacters(body.name);
      employee.lastname = capitalizeAllCharacters(body.lastname);
      employee.secondLastname = capitalizeAllCharacters(body.secondLastname);
      employee.street = capitalizeAllCharacters(body.street);
      employee.number = body.streetNumber;
      employee.colony = capitalizeAllCharacters(body.colony);
      employee.cp = body.cp;
      employee.state =capitalizeAllCharacters(body.state);
      employee.city = body.city;
      employee.primaryContact = body.phone;
      employee.birthDay = new Date(body.brithday);
      employee.rfc = body.rfc;
      employee.nss = body.nss;
      employee.startDate = format(new Date(), 'yyyy-MM-dd');
      employee.branchOfficeId = body.branchOfficeId;
      employee.jobScheme = body.contractType;
      employee.typeId = body.employeeType;
      employee.email = body.email;
      employee.gender = body.gender;
      employee.status = 1;

      const result = await this.employeeRepository.save(employee);

      const employeeRole = new EmployeeRoleEntity();
      employeeRole.roleId = Number(body.role);
      employeeRole.employeeId = Number(result.id);

      return await this.employeeRoleRepository.save(employeeRole);

    } catch (error) {
      console.log(error);
      HandleException.exception(error);
    }
  }

  updateEmployee = async (body: UpdateEmployeeDTO) => {
    try {

      let pass: string = '';
      const employee = await this.employeeRepository.findOneBy({ id: body.id });

      if (body.password != null && body.password != "") {
        pass = await SecurityUtil.encryptText(body.password);
      } else {
        pass = employee.password;
      }

      employee.user = body.user;
      employee.password = pass;
      employee.name = capitalizeAllCharacters(body.name);
      employee.lastname = capitalizeAllCharacters(body.lastname);
      employee.secondLastname = capitalizeAllCharacters(body.secondLastname);
      employee.street = capitalizeAllCharacters(body.street);
      employee.number = body.streetNumber;
      employee.colony =capitalizeAllCharacters(body.colony);
      employee.cp = body.cp;
      employee.state = capitalizeAllCharacters(body.state);
      employee.city = body.city;
      employee.primaryContact = body.phone;
      employee.birthDay = new Date(body.brithday);
      employee.rfc = body.rfc;
      employee.nss = body.nss;
      employee.branchOfficeId = body.branchOfficeId;
      employee.jobScheme = body.contractType;
      employee.typeId = body.employeeType;
      employee.email = body.email;
      employee.gender = body.gender;
      return await this.employeeRepository.save(employee);

    } catch (error) {
      console.log(error);
      HandleException.exception(error);
    }
  }
}
