import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { TELEGRAM_PARSE_MODE } from "./telegram-bot.service";

export class SentMessageDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  readonly text: string;

  @ApiProperty({
    type: String,
  })
  readonly chat_id: string;

  @ApiProperty({
    type: String,
    default: null,
  })
  @IsOptional()
  readonly message_thread_id?: string | null;

  @ApiProperty({
    type: String,
    enum: TELEGRAM_PARSE_MODE,
    example: TELEGRAM_PARSE_MODE.HTML,
  })
  @IsOptional()
  @IsEnum(TELEGRAM_PARSE_MODE)
  readonly parse_mode?: TELEGRAM_PARSE_MODE;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly entities?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly link_preview_options?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly disable_notification?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly protect_content?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly reply_parameters?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly reply_markup?: string;
}

export class SetWebhooksDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsOptional()
  readonly url?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly certificate?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly ip_address?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly reply_markup?: string;

  @ApiProperty({
    type: Number,
    default: 40,
  })
  @IsOptional()
  readonly max_connections?: number;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly allowed_updates?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly drop_pending_updates?: string;

  @ApiProperty({
    default: null,
  })
  @IsOptional()
  readonly secret_token?: string;
}
