import appConfig from "@config/app.config";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { getCurl } from "@shared/utils/get-curl";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { AnyObject } from "mongoose";
import { HttpClientService } from "src/http-client/http-client.service";
import { FormatterFn, TELEGRAM_PARSE_MODE, telegramFormatter } from "./telegram-formatter.type";
import { SentMessageDto, SetWebhooksDto } from "./telegram.dto";

@Injectable()
export class TelegramBotService {
  private readonly baseUrl = "https://api.telegram.org/bot";
  private readonly parseMode = TELEGRAM_PARSE_MODE.HTML;
  private readonly fetchErrorMessage = "telegram.fetch.error";

  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
    private readonly http: HttpClientService,
  ) {}

  private fmt(type: keyof (typeof telegramFormatter)[TELEGRAM_PARSE_MODE]): FormatterFn {
    return telegramFormatter[this.parseMode][type];
  }

  bold = (t = "") => this.fmt("bold")(t);
  italic = (t = "") => this.fmt("italic")(t);
  underline = (t = "") => this.fmt("underline")(t);
  strikethrough = (t = "") => this.fmt("strikethrough")(t);
  spoiler = (t = "") => this.fmt("spoiler")(t);
  link = (title = "", url = "") => this.fmt("link")(title, { url });
  code = (t = "") => this.fmt("code")(t);
  codeBlock = (t = "", config: { language?: string } = { language: "python" }) =>
    this.fmt("codeBlock")(t, config);

  async sendMessage(payload: SentMessageDto): Promise<AnyObject | string> {
    try {
      const data: SentMessageDto = {
        chat_id: payload.chat_id,
        text: payload.text,
        parse_mode: this.parseMode,
      };
      const url = `${this.baseUrl}${this.config.telegramChatID}/sendMessage`;
      const res = await this.http.post<AxiosResponse>(url, data);
      return res.data;
    } catch (error: unknown) {
      return this.http.handleAxiosError(error, "telegram.sent-message") ?? this.fetchErrorMessage;
    }
  }

  async getMe(): Promise<AnyObject | string> {
    try {
      const url = `${this.baseUrl}${this.config.telegramChatID}/getMe`;
      const res = await this.http.get<AxiosResponse>(url);
      return res.data;
    } catch (error) {
      return this.http.handleAxiosError(error, "telegram.get-me") ?? this.fetchErrorMessage;
    }
  }

  async setWebhooks(payload: SetWebhooksDto): Promise<void | string> {
    try {
      console.log("telegram.set-webhooks", payload);
    } catch (error) {
      return this.http.handleAxiosError(error, "telegram.set-webhooks") ?? this.fetchErrorMessage;
    }
  }

  async sentErrorToGroup(
    exception: AnyObject,
    request: Request,
    response: Response,
  ): Promise<void> {
    const reqBody = request.body ?? {};
    const resBody = {
      status:
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred please try again",
      system_message: exception.message,
    };

    const text = `${this.bold(this.config.name)}  [${this.config.env.toUpperCase()}]

${this.underline("[request]")}
method: ${this.bold(request.method.toUpperCase())}
url: ${this.bold(`${request.protocol}://${request.get("host")}${request.originalUrl}`)}
params: ${JSON.stringify(request.params, null, 3).replaceAll("\\n", "\n")}
query: ${JSON.stringify(request.query, null, 3).replaceAll("\\n", "\n")}
body:
${this.codeBlock(JSON.stringify(reqBody, null, 3).replaceAll("\\n", "\n"), { language: "json" })}

${this.underline("[exception]")}
${this.bold(exception.name)}: "${this.bold(exception.message)}"
${this.italic(JSON.stringify(exception.stack).replaceAll("\\n", "\n"))}

${this.underline("[response]")}
${this.bold(`${response.statusCode} ${response.statusMessage}`)}
${this.codeBlock(JSON.stringify(resBody, null, 3).replaceAll("\\n", "\n"), { language: "json" })}

${this.underline("[curl]")}
${this.code(getCurl(request))}`;

    await this.sendMessage({
      chat_id: this.config.telegramChatID,
      text,
      parse_mode: this.parseMode,
    });
  }
}
