import { PublicAPI } from "@auth/decorators/public-api.decorator";
import { Controller, Get, Param, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NoCache } from "@shared/decorators/no-cache.decorator";
import { MongoIdPipe } from "@shared/pipes/mongoid.pipe";
import { parseIpWithLocation } from "@shared/utils/parse-ip-location";
import { parseUserAgent } from "@shared/utils/parse-user-agent";
import { Request } from "express";
import { DeviceService } from "./device.service";

@Controller("devices")
@ApiTags("devices")
@ApiBearerAuth()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get("list-of-user/:userId")
  @NoCache()
  async getAllDevicesOfUserId(@Param("userId", MongoIdPipe) userId: string) {
    const devices = await this.deviceService.getAllDeviceOfUser(userId);
    return {
      _message: "Get all devices of user successfully",
      data: devices,
    };
  }

  @Get("parse-user-agent")
  @PublicAPI()
  getDeviceInfo(@Req() req: Request) {
    const info = parseUserAgent(req);
    return {
      _message: "Get device information successfully",
      data: info,
    };
  }

  @Get("parse-location")
  @PublicAPI()
  getLocation(@Req() req: Request) {
    const info = parseIpWithLocation(req);
    return {
      _message: "Get location information successfully",
      data: info,
    };
  }
}
