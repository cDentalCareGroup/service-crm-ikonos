import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import e from 'express';
import { HandleException } from 'src/common/exceptions/general.exception';
import { getDiff } from 'src/utils/general.functions.utils';
import { DataSource, Repository } from 'typeorm';
import { AvailableHoursDTO } from '../appointment/models/appointment.dto';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { ScheduleBranchOfficeInfoDTO, SchedulesEmployeeDTO } from '../employee/models/employee.dto';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { branchOfficeScheduleToEntity, branchOfficesToEntity, registerBranchOfficeScheduleToEntity } from './extensions/branch.office.extensions';
import { BranchOfficeSchedulesByIdDTO, BranchOfficeSchedulesDTO, DeleteBranchOfficeScheduleDTO, GetBranchOfficeScheduleDTO, RegisterBranchOfficeScheduleDTO, setFullDate } from './models/branch.office.dto';
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
    @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>
  ) { }


  getAllBranchOffices = async (): Promise<BranchOfficeEntity[]> => {
    try {
      //1 for active, 2 for inactive, 3 unavailable 
      const data = await this.branchOfficeRepository.find({ where: { status: 1 } });

      let branchOffices: BranchOfficeEntity[] = [];
      for await (const branchOffice of data) {
        const numOfAppointments = await this.appointmentRepository.findBy({ branchId: branchOffice.id, status: 'activa' });
        const item = branchOffice;
        item.appointmens = numOfAppointments.length;
        branchOffices.push(item);
      }


      return branchOffices.reverse();
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

  removeDuplicates = (arr: any[]): any[] => {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  groupBy = (collection, property) => {
    var i = 0, val, index,
      values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
        result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }
  getEmployeesSchedules = async (): Promise<SchedulesEmployeeDTO[]> => {
    try {

      const data: SchedulesEmployeeDTO[] = [];

      const employees = await this.employeeRepository.findBy({ typeId: 11 });

      for await (const employee of employees) {
        const result = await this.employeeRepository.createQueryBuilder('employee')
          .innerJoin('branch_schedule_dentist', 'bsd', 'employee.id = bsd.dentist_id')
          .innerJoin('branch_schedule', 'bs', 'bsd.branch_schedule_id = bs.ID')
          .innerJoinAndSelect('branch', 's', 's.id = bs.branch_id ')
          .where("employee.id = :employeeId", { employeeId: employee.id })
          .groupBy("employee.id")
          .addGroupBy('s.id')
          .getRawMany();

        let info: ScheduleBranchOfficeInfoDTO[] = [];
        for await (const item of result) {
          const employeeSchedules = await this.branchOfficeEmployeeScheduleRepository.createQueryBuilder('branch_schedule_dentist')
            .innerJoinAndSelect('branch_schedule', 'bs', 'branch_schedule_dentist.branch_schedule_id = bs.ID')
            .where('branch_schedule_dentist.branch_id = :branchId', { branchId: item.s_id })
            .andWhere('branch_schedule_dentist.dentist_id = :dentistId', { dentistId: item.empleado_id })
            .getRawMany();
          info.push(new ScheduleBranchOfficeInfoDTO(branchOfficesToEntity(item), branchOfficeScheduleToEntity(employeeSchedules)));
        }

        data.push(new SchedulesEmployeeDTO(employee, info));
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }

  }


  getBranchOfficeSchedules = async ({ branchOfficeName }: BranchOfficeSchedulesDTO): Promise<any> => {
    try {

      //1 for active, 2 for inactive, 3 unavailable 
      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchOfficeName });
      const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status: 'activo' } });
      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }

  getBranchOfficeSchedulesById = async ({ id }: BranchOfficeSchedulesByIdDTO): Promise<any> => {
    try {

      //1 for active, 2 for inactive, 3 unavailable 
      const branchOffice = await this.branchOfficeRepository.findOneBy({ id: Number(id) });
      const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status: 'activo' } });

      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  deleteBranchOfficeSchedule = async ({ scheduleId }: DeleteBranchOfficeScheduleDTO): Promise<any> => {
    try {
      await this.branchOfficeEmployeeScheduleRepository.delete({branchScheduleId: Number(scheduleId)});
      const schedule = await this.branchOfficeScheduleRepository.delete({ id: Number(scheduleId) });
      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }




  getBranchOfficeSchedulesEmployees = async ({ id }: BranchOfficeSchedulesByIdDTO): Promise<any> => {
    try {

      //1 for active, 2 for inactive, 3 unavailable 
      const branchOffice = await this.branchOfficeRepository.findOneBy({ id: Number(id) });
      const schedules = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status: 'activo' } });

      let data: GetBranchOfficeSchedulesEmployees[] = [];
      for await (const schedule of schedules) {
        const employeeSchedules = await this.branchOfficeEmployeeScheduleRepository.createQueryBuilder('branch_schedule_dentist')
          .innerJoin('branch_schedule', 'bs', 'branch_schedule_dentist.branch_schedule_id = bs.ID')
          .innerJoinAndSelect('employee', 'e', 'branch_schedule_dentist.dentist_id = e.id')
          .where('branch_schedule_dentist.branch_id = :branchId', { branchId: branchOffice.id })
          .andWhere('bs.id = :scheduleId', { scheduleId: schedule.id })
          .getRawMany();

        data.push(new GetBranchOfficeSchedulesEmployees(schedule, employeeSchedules.map((value,_) => this.employeeToEmployeEntity(value))))
      }
      return data;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }

  employeeToEmployeEntity = (data: any) => {
    if (data != null) {
      const employee = new EmployeeEntity();
      employee.name = data.e_name;
      employee.lastname = data.e_last_name1;
      employee.secondLastname = data.e_last_name2;
      employee.id = data.e_id;
      employee.branchOfficeId = data.e_branch_id;
      return employee;
    }
  }

  test = async () => {
    // const diff = 6;

    // const date = new Date(Date.UTC(2022,11,12,8,0,0));


    //   for (let index = 0; index < 5; index++) {

    //     date.setDate(date.getDate() + 1);
    //     for (let j = 0; j < 6; j++) {
    //       date.setHours(date.getHours() + 1);
    //       console.log(date)
    //     }

    //   }

    //   console.log(date);
    //   return "ok"
    //1 for active, 2 for inactive, 3 unavailable 
    const branchOffice = await this.branchOfficeRepository.findOneBy({ name: 'Palmas' });

    const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status: 'activo' } });

    let availableHours = [];
    const today = new Date();
    let currentDay = today.getDate();

    for await (const dayTime of schedule) {

      const startTime = dayTime.startTime.toString();
      const startTimeArray = startTime.split(":");
      const startHour = Number(startTimeArray[0]);
      const startMinutes = Number(startTimeArray[1]);
      const startSeconds = Number(startTimeArray[2]);
      const startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, startHour, startMinutes, startSeconds))

      const endTime = dayTime.endTime.toString();
      const endTimeArray = endTime.split(":");
      const endHour = Number(endTimeArray[0]);
      const endMinutes = Number(endTimeArray[1]);
      const endSeconds = Number(endTimeArray[2]);
      const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, endHour, endMinutes, endSeconds))

      const dif = getDiff(startDate, endDate) + 1;

      for (let index = 0; index < dif; index++) {
        let hourToAdd = (startHour + index);
        let hourResult = hourToAdd < 10 ? `0${hourToAdd}` : hourToAdd;
        let amOrPm = hourToAdd < 12 ? 'AM' : 'PM';
        if (hourToAdd <= endHour) {
          availableHours.push(`${hourResult}:${startMinutes}0 ${amOrPm}`);
        }
      }
      console.log(`${dayTime.dayName} -- ${availableHours}`);
      availableHours = [];
    }


    //console.log(schedule);
  }
}

export class GetBranchOfficeSchedulesEmployees {
  schedule: BranchOfficeScheduleEntity;
  employees: EmployeeEntity[];

  constructor(schedule: BranchOfficeScheduleEntity,
    employees: EmployeeEntity[]){
      this.schedule = schedule;
      this.employees = employees;
    }
}






