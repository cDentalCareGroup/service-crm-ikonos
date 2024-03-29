import { STATUS_ACTIVE } from "src/utils/general.functions.utils";
import { RegisterBranchOfficeScheduleDTO } from "../models/branch.office.dto";
import { BranchOfficeEntity } from "../models/branch.office.entity";
import { BranchOfficeScheduleEntity } from "../models/branch.office.schedule.entity";



const registerBranchOfficeScheduleToEntity = (data: RegisterBranchOfficeScheduleDTO): BranchOfficeScheduleEntity => {

  const startTime = new Date();
  const endTime = new Date();
  startTime.setHours(Number(data.startTime.split(":")[0]), Number(data.startTime.split(":")[1]), Number(data.startTime.split(":")[2]));
  endTime.setHours(Number(data.endTime.split(":")[0]), Number(data.endTime.split(":")[1]), Number(data.endTime.split(":")[2]));

  const schedule = new BranchOfficeScheduleEntity();
  schedule.dayName = data.dayName;
  schedule.startTime = startTime
  schedule.endTime = endTime;
  schedule.seat = Number(data.seat);
  schedule.status = STATUS_ACTIVE;
  schedule.branchId = data.branchOfficeId;
  return schedule;
}


const branchOfficesToEntity = (element: any): BranchOfficeEntity => {
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


const branchOfficeScheduleToEntity = (data: any): BranchOfficeScheduleEntity[] => {
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

const branchOfficesToMessage = (data: BranchOfficeEntity[]): string => {
  let value: string = ''
  for (const item of data) {
    const address = `${item?.street ?? ''} ${item?.number ?? ''} ${item?.colony ?? ''}, CP.${item?.cp ?? ''}`;
    value += `📍 ${item.name} - ${address}\n`
  }
  return value;
}

export { registerBranchOfficeScheduleToEntity, branchOfficesToEntity, branchOfficeScheduleToEntity, branchOfficesToMessage };