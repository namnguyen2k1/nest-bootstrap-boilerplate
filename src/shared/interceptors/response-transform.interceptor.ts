import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        const { _status = 200, _message = 'Success', ...data } = res;
        return {
          status: _status,
          message: _message,
          data: data?.data,
          timestamp: Date.now(),
        };
      }),
    );
  }
}
