import { Injectable } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getTodayDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  getHello(): any {

    return {
      'version': 'Version 1.0.10 - Firebase v1',
      'date': getTodayDate(),
    }
  }
}

