import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { lastValueFrom, map } from 'rxjs';
import { HandleException } from './common/exceptions/general.exception';
import { capitalizeAllCharacters, getTodayDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) {

  }
  async getHello() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const nextDate = date.toISOString().split("T")[0];

    return {
      'version': 'Version 1.0.33.2',
      'date': new Date().toISOString().split("T")[0]
    }
  }

}

