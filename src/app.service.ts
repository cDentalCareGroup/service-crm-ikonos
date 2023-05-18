import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { lastValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { HandleException } from './common/exceptions/general.exception';
import { UserLogsEntity } from './modules/auth/models/entities/user.logs.entity';
import { capitalizeAllCharacters, formatDateToWhatsapp, getSimpleTodayDate, getTodayDate, getTodaySimpleDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
  ) {

  }
  async getHello() {
    return {
      'version': `Version 1.0.47.17-${process.env.ENV_NAME}`,
      'today Date': getTodayDate(),
      'simple Today Date': getSimpleTodayDate(),
      'today Simple Date': getTodaySimpleDate(),
      'variables': {
        'DNAME': process.env.DB_NAME,
        'WS': process.env.WTS_API_URL,
        'INSTANCE': process.env.WTS_INSTANCE_ID
      } 
    }
  }
}

