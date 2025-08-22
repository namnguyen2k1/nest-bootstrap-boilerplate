import appConfig from "@config/app.config";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { getCurl } from "@shared/utils/get-curl";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { AnyObject } from "mongoose";
import { HttpClientService } from "src/http-client/http-client.service";
import { SentMessageDto, SetWebhooksDto } from "./telegram.dto";

export enum TELEGRAM_PARSE_MODE {
  MARKDOWN_V2 = "markdownv2",
  MARKDOWN = "markdown",
  HTML = "html",
}

@Injectable({})
export class TelegramBotService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
    private readonly http: HttpClientService,
  ) {}

  private readonly baseUrl = "https://api.telegram.org/bot";
  private parseMode = TELEGRAM_PARSE_MODE.HTML;
  private readonly fetchErrorMessage = "telegram.fetch.error";

  async sentErrorToGroup(
    exception: AnyObject,
    request: Request,
    response: Response,
  ): Promise<void> {
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
${this.codeBlock(JSON.stringify(request.body, null, 3).replaceAll("\\n", "\n"), { language: "json" })}

${this.underline("[exception]")}
${this.bold(exception.name)}: \"${this.bold(exception.message)}\"
${this.italic(JSON.stringify(exception.stack).replaceAll("\\n", "\n"))}

${this.underline("[response]")}
${this.bold(`${response.statusCode} ${response.statusMessage}`)}
${this.codeBlock(JSON.stringify(resBody, null, 3).replaceAll("\\n", "\n"), { language: "json" })}

${this.underline("[curl]")}
${this.code(getCurl(request))}`;

    const payload: SentMessageDto = {
      chat_id: this.config.telegramChatID,
      text,
      parse_mode: TELEGRAM_PARSE_MODE.HTML,
    };
    await this.sendMessage(payload);
  }

  async setWebhooks(payload: SetWebhooksDto): Promise<void | string> {
    try {
      console.log("telegram.set-webhooks", payload);
    } catch (error) {
      return this.http.handleAxiosError(error, "telegram.set-webhooks") ?? this.fetchErrorMessage;
    }
  }

  async getMe(): Promise<AnyObject | string> {
    try {
      const url = `${this.baseUrl}${this.config.telegramChatID}/getMe`;
      const res = await this.http.get<AxiosResponse>(url);
      // console.log("telegram.get-me", JSON.stringify(res.data, null, 3));
      return res.data;
    } catch (error) {
      return this.http.handleAxiosError(error, "telegram.get-me") ?? this.fetchErrorMessage;
    }
  }

  async sendMessage(payload: SentMessageDto): Promise<AnyObject | string> {
    try {
      const data: SentMessageDto = {
        chat_id: payload.chat_id,
        text: payload.text,
        parse_mode: this.parseMode,
      };
      const url = `${this.baseUrl}${this.config.telegramChatID}/sendMessage`;
      const res = await this.http.post<AxiosResponse>(url, data);
      // console.log("telegram.sent-message", JSON.stringify(res.data, null, 3));
      return res.data;
    } catch (error: unknown) {
      return this.http.handleAxiosError(error, "telegram.sent-message") ?? this.fetchErrorMessage;
    }
  }

  bold(text: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return text;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return `*${text}*`;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<b>${text}</b>`;
      }
      default: {
        return text;
      }
    }
  }

  italic(text: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return text;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return `_${text}_`;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<i>${text}</i>`;
      }
      default: {
        return text;
      }
    }
  }

  underline(text: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return text;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return text;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<u>${text}</u>`;
      }
      default: {
        return text;
      }
    }
  }

  strikethrough(text: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return `~${text}~`;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return text;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<s>${text}</s>`;
      }
      default: {
        return text;
      }
    }
  }

  spoiler(text: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return `||${text}||`;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return text;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<span class="tg-spoiler">${text}</span>`;
      }
      default: {
        return text;
      }
    }
  }

  link(title: string = "", url: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return `[${title}](${url})`;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return `[${title}](${url})`;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<a href='${url}'>${title}</a>`;
      }
      default: {
        return `[${title}]: ${url}`;
      }
    }
  }

  code(text: string = ""): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return `\`${text}\``;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return `\`${text}\``;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<code>${text}</code>`;
      }
      default: {
        return text;
      }
    }
  }

  codeBlock(
    text: string = "",
    config: {
      language?: string;
    } = {
      language: "python",
    },
  ): string {
    switch (this.parseMode) {
      case TELEGRAM_PARSE_MODE.MARKDOWN_V2: {
        return `\`\`\`${config.language}\n${text}\`\`\``;
      }
      case TELEGRAM_PARSE_MODE.MARKDOWN: {
        return `\`\`\`${config.language}\n${text}\`\`\``;
      }
      case TELEGRAM_PARSE_MODE.HTML: {
        return `<pre><code class="language-${config.language}">${text}</code></pre>`;
      }
      default: {
        return text;
      }
    }
  }
}
