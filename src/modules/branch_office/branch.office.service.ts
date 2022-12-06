import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { registerBranchOfficeScheduleToEntity } from './extensions/branch.office.extensions';
import { BranchOfficeSchedulesDTO, GetBranchOfficeScheduleDTO, RegisterBranchOfficeScheduleDTO, setFullDate } from './models/branch.office.dto';
import { BranchOfficeEmployeeSchedule } from './models/branch.office.employee.entity';
import { BranchOfficeEntity } from './models/branch.office.entity';
import { BranchOfficeScheduleEntity } from './models/branch.office.schedule.entity';

@Injectable()
export class BranchOfficeService {
  constructor(
    @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
    @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(BranchOfficeScheduleEntity) private branchOfficeScheduleRepository: Repository<BranchOfficeScheduleEntity>,
    @InjectRepository(BranchOfficeEmployeeSchedule) private branchOfficeEmployeeScheduleRepository: Repository<BranchOfficeEmployeeSchedule>,
  ) { }


  getAllBranchOffices = async (): Promise<BranchOfficeEntity[]> => {
    try {
      //1 for active, 2 for inactive, 3 unavailable 
      const data = await this.branchOfficeRepository.find({ where: { status: 1 } });
      return data;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  getScheduleBranchOffices = async (): Promise<GetBranchOfficeScheduleDTO[]> => {
    try {
      const data: GetBranchOfficeScheduleDTO[] = [];
      //1 for active, 2 for inactive, 3 unavailable 
      const branchOffices = await this.branchOfficeRepository.find({ where: { status: 1 } });

      for await (const branchOffice of branchOffices) {
        const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id } });
        data.push(new GetBranchOfficeScheduleDTO(branchOffice, schedule));
      }
      return data;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }

  registerBranchOfficeSchedule = async (data: RegisterBranchOfficeScheduleDTO): Promise<GetBranchOfficeScheduleDTO> => {
    try {

      await this.branchOfficeScheduleRepository.save(registerBranchOfficeScheduleToEntity(data));
      const branchOffice = await this.branchOfficeRepository.findOneBy({ id: data.branchOfficeId });
      const schedules = await this.branchOfficeScheduleRepository.find({ where: { branchId: data.branchOfficeId } });

      return new GetBranchOfficeScheduleDTO(branchOffice, schedules);
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  getEmployeeSchedules = async (): Promise<any> => {
    try {

      const employees = await this.employeeRepository.find({ where: { typeId: 11 } });
      const data = [];
      for await (const employee of employees) {
        const schedulesEmployee = await this.branchOfficeEmployeeScheduleRepository.findBy({ employeeId: employee.id });

          const schedules = [];
          for await (const scheduleEmployee of schedulesEmployee) {
            const schedule = await this.branchOfficeScheduleRepository.findOneBy({ id: scheduleEmployee.branchScheduleId });
            schedules.push(schedule);
          }

          const branchOffice = await this.branchOfficeRepository.findOneBy({ id: employee.branchOfficeId });
          data.push(new SchedulesEmployee(employee, branchOffice, schedules));

      }

      return data;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }




  getBranchOfficeSchedules = async ({branchOfficeName}: BranchOfficeSchedulesDTO): Promise<any> => {
    try {

      //1 for active, 2 for inactive, 3 unavailable 
      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchOfficeName });
      const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status:'activo' } });
      
      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


}


class SchedulesEmployee {
  employee: EmployeeEntity;
  branchOffice: BranchOfficeEntity;
  schedules: BranchOfficeScheduleEntity[];

  constructor(employee: EmployeeEntity,
    branchOffice: BranchOfficeEntity,
    schedules: BranchOfficeScheduleEntity[]) {
    this.employee = employee;
    this.branchOffice = branchOffice;
    this.schedules = schedules.map((value, _) => setFullDate(value));
  }

}