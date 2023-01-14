import { Injectable } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getTodayDate } from './utils/general.functions.utils';


@Injectable()
export class AppService {
  async getHello() {

    const date = new Date();
    date.setDate(date.getDate() + 1);
    const nextDate = date.toISOString().split("T")[0];


    const date2 = new Date();
    date2.setDate(date2.getDate() - 1);
    const nextDate2 = date2.toISOString().split("T")[0];
    const col = await this.getColoniesFromPostalCode();

    return {
      'version': 'Version 1.0.15 - Firebase v.1',
      'date': getTodayDate(),
      'currentDate': new Date(),
      'currentDate+1': date,
      'remindersAt': nextDate,
      'cancelledAt': nextDate2,
      'col':col
    }
  }

  getColoniesFromPostalCode = async() => {
    try {
      const response = await fetch(`https://www.walmart.com.mx/api/wmx/service/v1/common/neighborhood/details?zipcode=62157&channel=4&shipping=1`,)
      .then(response => response.json());
      return response
    } catch (error) {
      console.log(error);
    }
  }
}

