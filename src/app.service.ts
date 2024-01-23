import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async initApp() {
    let data = '';
    if (process.env.ENV_NAME.toLocaleLowerCase() == 'development') {
      data = JSON.stringify(process.env);
    }

    return {
      version: `Version ${process.env.SERVICE_VERSION}-${process.env.ENV_NAME}`,
      env: data,
    };
  }
}
