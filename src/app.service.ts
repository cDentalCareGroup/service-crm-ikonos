import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { lastValueFrom, map } from 'rxjs';
import { HandleException } from './common/exceptions/general.exception';
import { capitalizeAllCharacters, formatDateToWhatsapp, getTodayDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) {

  }
  async getHello() {
    return {
      'version': 'Version 1.0.35.2',
      'date': new Date().toISOString().split("T")[0],
      'whatsapptime': `${formatDateToWhatsapp('2023-02-14')} - 10:30 AM`
    }
  }

}

