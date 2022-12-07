import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { HandleException } from 'src/common/exceptions/general.exception';
import { DataSource, Repository } from 'typeorm';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { registerBranchOfficeScheduleToEntity } from './extensions/branch.office.extensions';
import { BranchOfficeSchedulesDTO, DeleteBranchOfficeScheduleDTO, GetBranchOfficeScheduleDTO, RegisterBranchOfficeScheduleDTO, setFullDate } from './models/branch.office.dto';
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
  getEmployeeSchedules = async (): Promise<SchedulesEmployee[]> => {
    try {

      const data: SchedulesEmployee[] = [];

      const employees = await this.employeeRepository.findBy({ typeId: 11 });

      for await (const employee of employees) {
        const result = await this.employeeRepository.createQueryBuilder('empleado')
          .innerJoin('branch_schedule_dentist', 'bsd', 'empleado.id = bsd.dentist_id')
          .innerJoin('branch_schedule', 'bs', 'bsd.branch_schedule_id = bs.ID')
          .innerJoinAndSelect('sucursal', 's', 's.id = bs.branch_id ')
          .where("empleado.id = :employeeId", { employeeId: employee.id })
          .groupBy("empleado.id")
          .addGroupBy('s.id')
          .getRawMany();

        let info: ScheduleBranchOfficeInfo[] = [];
        for await (const item of result) {
          const employeeSchedules = await this.branchOfficeEmployeeScheduleRepository.createQueryBuilder('branch_schedule_dentist')
            .innerJoinAndSelect('branch_schedule', 'bs', 'branch_schedule_dentist.branch_schedule_id = bs.ID')
            .where('branch_schedule_dentist.branch_id = :branchId', { branchId: item.s_id })
            .andWhere('branch_schedule_dentist.dentist_id = :dentistId', { dentistId: item.empleado_id })
            .getRawMany();
            info.push(new ScheduleBranchOfficeInfo(this.branchOfficesToEntity(item), this.branchOfficeScheduleToEntity(employeeSchedules)));
        }

        data.push(new SchedulesEmployee(employee, info));
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


  deleteBranchOfficeSchedule = async ({ scheduleId }: DeleteBranchOfficeScheduleDTO): Promise<any> => {
    try {
      const schedule = await this.branchOfficeScheduleRepository.delete({ id: Number(scheduleId) });
      return schedule;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }



  employeeQueryToEntity = (data: any): EmployeeEntity => {
    const employee = new EmployeeEntity();
    employee.id = data.empleado_id;
    employee.name = data.empleado_nombre;
    employee.lastname = data.empleado_paterno;
    employee.secondLastname = data.empleado_materno;
    employee.status = data.empleado_idEstatus;
    employee.stateId = data.empleado_idEstado;
    employee.municipalityId = data.empleado_idMunicipio;
    employee.jobScheme = data.empleado_idEsquemaLaboral;
    employee.typeId = data.empleado_idTipoEmpleado;
    employee.branchOfficeId = data.empleado_idSucursal;
    employee.street = data.empleado_calle;
    employee.number = data.empleado_numero;
    employee.colony = data.empleado_colonia;
    employee.cp = data.empleado_codigo_postal;
    employee.primaryContact = data.empleado_telefono_principal;
    employee.secondaryContact = data.empleado_telefono_secundario;
    employee.curp = data.empleado_curp;
    employee.birthDay = data.empleado_fecha_nacimiento;
    employee.rfc = data.empleado_rfc;
    employee.nss = data.empleado_nss;
    return employee;
  }
  branchOfficesToEntity = (element: any): BranchOfficeEntity => {
    // const branchesOffices = [];
    // if (data != null) {
    //   data.forEach(element => {
        
    //   });
    // }
    // return branchesOffices;
    const branchoffice = new BranchOfficeEntity();
        branchoffice.id = element.s_id;
        branchoffice.name = element.s_nombre;
        branchoffice.street = element.s_calle;
        branchoffice.number = element.s_numero;
        branchoffice.colony = element.s_colonia;
        branchoffice.cp = element.s_codigo_postal;
        branchoffice.primaryContact = element.s_telefono_principal;
        branchoffice.primaryBranchOfficeContact = element.s_telefono_sucursal;
        branchoffice.email = element.s_email;
        branchoffice.status = element.s_idEstatusSucursal;
        return branchoffice;
  }

  branchOfficeScheduleToEntity = (data: any): BranchOfficeScheduleEntity[] => {
    const schedules = [];
    if (data != null) {
      data.forEach(element => {
        const branchOfficeScheduleEntity = new BranchOfficeScheduleEntity();
        branchOfficeScheduleEntity.id = element.branch_schedule_dentist_id;
        branchOfficeScheduleEntity.branchId = element.bs_branch_id;
        branchOfficeScheduleEntity.dayName = element.bs_day_name;
        branchOfficeScheduleEntity.startTime = element.bs_start_time;
        branchOfficeScheduleEntity.endTime = element.bs_end_time;
        branchOfficeScheduleEntity.seat = element.bs_seat;
        branchOfficeScheduleEntity.status = element.bs_status;
        schedules.push(branchOfficeScheduleEntity);
      });
    }
    return schedules;
  }

}


class SchedulesEmployee {
  employee: EmployeeEntity;
  info: ScheduleBranchOfficeInfo[];

  constructor(employee: EmployeeEntity,
    info: ScheduleBranchOfficeInfo[]) {
    this.employee = employee;
    this.info = info;
  }

}
class ScheduleBranchOfficeInfo {
  branchOffice: BranchOfficeEntity;
  schedules: BranchOfficeScheduleEntity[];

  constructor(
    branchOffice: BranchOfficeEntity,
    schedules: BranchOfficeScheduleEntity[]) {
    this.branchOffice = branchOffice;
    this.schedules = schedules.map((value, _) => setFullDate(value));
  }
}


