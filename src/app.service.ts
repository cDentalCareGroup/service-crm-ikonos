import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  
  async initApp() {
    return {
      'version': `Version ${process.env.SERVICE_VERSION}-${process.env.ENV_NAME}`,
      'variables': {
        'DNAME': process.env.DB_NAME,
      },
    }
  }
}

