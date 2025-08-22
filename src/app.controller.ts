import { PublicAPI } from "@auth/decorators/public-api.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller("global")
@ApiTags("global")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @PublicAPI()
  heathCheck() {
    return {
      data: "Healthy",
    };
  }
}
