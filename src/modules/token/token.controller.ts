import { PublicAPI } from "@auth/decorators/public-api.decorator";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TokenService } from "./services/token.service";

@Controller("tokens")
@ApiTags("tokens")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get("access-token/:token")
  @PublicAPI()
  async getInfoToken(@Param("token") token: string) {
    const result = await this.tokenService.getAccessTokenInfo(token);
    return {
      _message: "Get access token information successfully",
      data: result,
    };
  }
}
