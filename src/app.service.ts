import { Injectable } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getTodayDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  getHello(): any {

    const date = new Date();
    date.setDate(date.getDate() + 1);
    const nextDate = date.toISOString().split("T")[0];


    const date2 = new Date();
    date2.setDate(date2.getDate() - 1);
    const nextDate2 = date2.toISOString().split("T")[0];


    return {
      'version': 'Version 1.0.12 - Firebase v1',
      'date': getTodayDate(),
      'currentDate': new Date(),
      'currentDate+1': date,
      'remindersAt': nextDate,
      'cancelledAt': nextDate2
    }
  }
}

