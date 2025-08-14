import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { TIME_ZONE } from '@shared/utils/time-zone';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inspect } from 'util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const request: Request = context.switchToHttp().getRequest();
    const startTime = new Date();
    const timezone = startTime.toLocaleString('vi', {
      timeZone: TIME_ZONE.VIETNAM,
    });
    const { method, originalUrl, params, query, body } = request;

    console.log(`
--> ${method} ${originalUrl} ${timezone}
params: ${this.logObj(params)}
query: ${this.logObj(query)}
body: ${this.logObj(body)}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode: number = response.statusCode;
        const statusMessage: string = response.statusMessage ?? 'OK';
        const executeTime = Date.now() - startTime.getTime();
        console.log(`
<-- ${method} ${originalUrl} ${statusCode} ${statusMessage} ${executeTime}ms`);
      }),
    );
  }

  private logObj(obj: any) {
    if (!obj) {
      return 'null';
    } else if (Object.keys(obj).length === 0) {
      return '{}';
    }
    return inspect(obj);
  }
}
