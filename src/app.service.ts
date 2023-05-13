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
      'Version': 'Version 1.0.47.13-PROD',
      'Today Date': getTodayDate(),
      'Simple Today Date': getSimpleTodayDate(),
      'Today Simple Date': getTodaySimpleDate(),
      'Variables': {
        'DNAME': process.env.DB_NAME,
        'WS': process.env.WTS_API_URL,
        'INSTANCE': process.env.WTS_INSTANCE_ID
      } 
    }
  }
}

