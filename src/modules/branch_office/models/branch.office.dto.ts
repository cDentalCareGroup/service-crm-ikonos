import { ApiProperty } from "@nestjs/swagger";
import { BranchOfficeEntity } from "./branch.office.entity";
import { BranchOfficeScheduleEntity } from "./branch.office.schedule.entity";

export class GetBranchOfficeScheduleDTO {

  branchOffice: BranchOfficeEntity;
  schedules: BranchOfficeScheduleEntity[] = [];

  constructor(branchOffice: BranchOfficeEntity,
    schedules: BranchOfficeScheduleEntity[]) {
    this.branchOffice = branchOffice;
    this.schedules = schedules.map((value, _) => setFullDate(value));

  }
}

export class RegisterBranchOfficeScheduleDTO {
  @ApiProperty({
    description: 'branch office id',
    example: '1',
  })
  branchOfficeId: number;

  @ApiProperty({
    description: 'start time ',
    example: '10:00 ',
  })
    startTime: string;
    @ApiProperty({
      description: 'end time',
      example: '20:00:00',
    })
    endTime: string;
    @ApiProperty({
      description: 'day name',
      example: 'Lunes, Martes, Miercoles, Jueves, Viernes',
    })
    dayName: string;

    @ApiProperty({
      description: 'number of seats',
      example: '1,2,3',
    })
    seat: string;

}

export class BranchOfficeSchedulesDTO {
  @ApiProperty({
    description: 'name of the branch office',
    example: 'Las palmas',
  })
  branchOfficeName: string;
}

export class BranchOfficeSchedulesByWeekDTO {
  @ApiProperty({
    description: 'name of the branch office',
    example: 'Las palmas',
  })
  branchOfficeName: string;
  @ApiProperty({
    description: 'name of day',
    example: 'Lunes, martes',
  })
  dayName: string;
}

export class DeleteBranchOfficeScheduleDTO {
  @ApiProperty({
    description: 'schedule id',
    example: '1,2',
  })
  scheduleId: number | string;
}



export const setFullDate = (object: BranchOfficeScheduleEntity): BranchOfficeScheduleEntity => {

  try {
    
    const today = getMonday(new Date());

    let currentDay = today.getDate();

    const day = object.dayName.toLowerCase();


    if (day == 'lunes') {
      currentDay = today.getDate();
    } else if(day == 'martes') {
      currentDay = today.getDate() + 1;
    }else if(day == 'miercoles') {
      currentDay = today.getDate() + 2;
    }else if(day == 'jueves') {
      currentDay = today.getDate() + 3;
    }else if(day == 'viernes') {
      currentDay = today.getDate() + 4;
    }else if(day == 'sabado') {
      currentDay = today.getDate() + 5;
    }else if(day == 'domingo') {
      currentDay = today.getDate() + 6;
    }


    const startTime = object.startTime.toString();
    const startTimeArray = startTime.split(":");
    const startHour = Number(startTimeArray[0]);
    const startMinutes = Number(startTimeArray[1]);
    const startSeconds = Number(startTimeArray[2]);

    const startDate = new Date(Date.UTC(today.getFullYear(),today.getMonth(),currentDay,startHour,startMinutes,startSeconds));
   
    

    const endTime = object.endTime.toString();
    const endTimeArray = endTime.split(":");
    const endHour = Number(endTimeArray[0]);
    const endMinutes = Number(endTimeArray[1]);
    const endSeconds = Number(endTimeArray[2]);

    const endDate = new Date(Date.UTC(today.getFullYear(),today.getMonth(),currentDay,endHour,endMinutes,endSeconds));


    const newObject = object;
    newObject.startTime = startDate;
    newObject.endTime = endDate;
    return newObject;
  } catch (error) {
    return object;
  }
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

