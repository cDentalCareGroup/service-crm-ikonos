import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { lastValueFrom, map } from 'rxjs';
import { HandleException } from './common/exceptions/general.exception';
import { getTodayDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) {

  }
  async getHello() {



    const date = new Date();
    date.setDate(date.getDate() + 1);
    const nextDate = date.toISOString().split("T")[0];


    const date2 = new Date();
    date2.setDate(date2.getDate() - 1);
    const nextDate2 = date2.toISOString().split("T")[0];
    const col = await this.getColoniesFromPostalCode();

    return {
      'version': 'Version 1.0.20 - Firebase v.1.0.0',
      'col':col

    }
  }

  getColoniesFromPostalCode = async () => {
    try {
      const request = this.httpService
        .get(
          `https://www.walmart.com.mx/api/wmx/service/v1/common/neighborhood/details?zipcode=62157&channel=4&shipping=1`,
        )
        .pipe(map((res) => res.data))
      const response = await lastValueFrom(request);
      return response
    } catch (error) {
      HandleException.exception(error);
    }
  }
}

