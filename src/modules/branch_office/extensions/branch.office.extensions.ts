import { RegisterBranchOfficeScheduleDTO } from "../models/branch.office.dto";
import { BranchOfficeScheduleEntity } from "../models/branch.office.schedule.entity";



const registerBranchOfficeScheduleToEntity =  (data: RegisterBranchOfficeScheduleDTO): BranchOfficeScheduleEntity => {

    const startTime = new Date();
    startTime.setHours(Number(data.startTime.split(":")[0]),Number(data.startTime.split(":")[1]),0);


    const endTime = new Date();
    endTime.setHours(Number(data.endTime.split(":")[0]),Number(data.endTime.split(":")[1]),0);


    const schedule = new BranchOfficeScheduleEntity();
    schedule.dayName = data.dayName;
    schedule.startTime = startTime
    schedule.endTime = endTime;
    schedule.seat = Number(data.seat);
    schedule.status = 'activo';
    schedule.branchId = data.branchOfficeId;
    return schedule;
}

export {registerBranchOfficeScheduleToEntity};