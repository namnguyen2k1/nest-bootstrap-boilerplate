import { AUTH_ERROR } from "@auth/enum/auth-error-code.enum";
import { Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Request, Response } from "express";
import { TelegramBotService } from "src/http-client/third-part-services/telegram/telegram-bot.service";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly host: HttpAdapterHost,
    private readonly telegramService: TelegramBotService,
  ) {}

  catch(exception: Error, host: ExecutionContextHost): void {
    const request = host.getArgByIndex<Request>(0);
    const response = host.getArgByIndex<Response>(1);
    const hostType = host.getType();
    let status: HttpStatus | number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = exception.message;
    let code: any;
    let errors: any;

    if (hostType == "http" && exception instanceof HttpException) {
      status = exception.getStatus();
      const error = exception.getResponse() as any;
      if (typeof error === "string") {
        message = error;
      } else {
        // catch dto validation
        if (Array.isArray(error?.message)) {
          errors = error?.message;
        } else {
          message = error?.message ?? null;
          code = error?.code ?? null;
        }
      }
    }
    if (Array.isArray(message?.message)) {
      // catch validate errors
      errors = message?.message ?? null;
      message = message?.error ?? null;
      code = AUTH_ERROR.VALIDATION;
    } else if (typeof message?.message === "string") {
      // catch errors
      errors = [message?.message];
      message = message?.error ?? null;
    }

    const body = {
      path: request.url,
      method: request.method,
      status: status,
      ...(message && {
        message,
      }),
      ...(errors && {
        errors,
      }),
      ...(code && {
        code,
      }),
    };
    console.log("[exception]", body);
    this.host.httpAdapter.reply(response, body, status);
    this.telegramService.sentErrorToGroup(exception, request, response);
  }
}
