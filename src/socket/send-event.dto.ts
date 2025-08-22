import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SOCKET_EVENT } from "./socket.enum";

export class SendEventDto {
  @IsEnum(SOCKET_EVENT)
  type: SOCKET_EVENT;

  @IsNotEmpty()
  data: any;

  @IsOptional()
  @IsString()
  userId?: string;
}
