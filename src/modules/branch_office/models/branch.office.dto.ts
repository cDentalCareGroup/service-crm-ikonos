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



const setFullDate = (object: BranchOfficeScheduleEntity): BranchOfficeScheduleEntity => {

  try {
    
    const today = getMonday(new Date());

    let day = today.getDate();

    if (object.dayName == 'lunes') {
      day = today.getDate();
    } else if(object.dayName == 'martes') {
      day = today.getDate() + 1;
    }else if(object.dayName == 'miercoles') {
      day = today.getDate() + 2;
    }else if(object.dayName == 'jueves') {
      day = today.getDate() + 3;
    }else if(object.dayName == 'viernes') {
      day = today.getDate() + 4;
    }else if(object.dayName == 'sabado') {
      day = today.getDate() + 5;
    }else if(object.dayName == 'domingo') {
      day = today.getDate() + 6;
    }


    const startTime = object.startTime.toString();
    const startTimeArray = startTime.split(":");
    const startHour = Number(startTimeArray[0]);
    const startMinutes = Number(startTimeArray[1]);
    const startSeconds = Number(startTimeArray[2]);

    const startDate = new Date(Date.UTC(today.getFullYear(),today.getMonth(),day,startHour,startMinutes,startSeconds));
   
    

    const endTime = object.endTime.toString();
    const endTimeArray = endTime.split(":");
    const endHour = Number(endTimeArray[0]);
    const endMinutes = Number(endTimeArray[1]);
    const endSeconds = Number(endTimeArray[2]);

    const endDate = new Date(Date.UTC(today.getFullYear(),today.getMonth(),day,endHour,endMinutes,endSeconds));


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

