import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
  status: number;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const status = 200;
    const message = 'success';
    // let isWebHook = false;
    // for (const args of context.getArgs()) {
    //   if (args.originalUrl != null && args.originalUrl != "" && args.originalUrl.includes('/webhooks')) {
    //     isWebHook = true;
    //   }
    // }
    // //console.log(isWebHook);
    // if (isWebHook) {
    //   return next.handle()
    // } else {
    //   return next.handle().pipe(map((data) => ({ data, status, message })));
    // }
    return next.handle().pipe(map((data) => ({ data, status, message })));
  }
}
