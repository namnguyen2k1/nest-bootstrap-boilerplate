import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LOCALE } from '@shared/utils/locale';
import { logObj } from '@shared/utils/log-obj';
import { TIME_ZONE } from '@shared/utils/time-zone';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const request: Request = context.switchToHttp().getRequest();
    const startTime = new Date();
    const timezone = startTime.toLocaleString(LOCALE.VIETNAM, {
      timeZone: TIME_ZONE.VIETNAM,
    });
    const { method, originalUrl, params, query, body } = request;

    console.log(`
--> ${method} ${originalUrl} ${timezone}
params: ${logObj(params)}
query: ${logObj(query)}
body: ${logObj(body)}`);

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
}
