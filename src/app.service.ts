import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  c
  async getHello() {
    return {
      'version': `Version 1.0.49.5-${process.env.ENV_NAME}`,
      'variables': {
        'DNAME': process.env.DB_NAME,
        'WS': process.env.WTS_API_URL,
        'INSTANCE': process.env.WTS_INSTANCE_ID
      },
    }
  }
}

