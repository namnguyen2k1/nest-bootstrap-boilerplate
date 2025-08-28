import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "@user/user.module";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbModule } from "src/infrastructure/database/mongodb/mongodb.module";
import { JsonWebTokenService } from "src/modules/token/services/json-web-token.service";
import { DeviceModule } from "../device/device.module";
import { HashingService } from "./services/hashing.service";
import { TokenService } from "./services/token.service";
import { TokenController } from "./token.controller";
import { TokenRepository } from "./token.repository";
import { TokenSchema } from "./token.schema";

const PROVIDERS = [JsonWebTokenService, HashingService, TokenService];

@Module({
  imports: [
    MongodbModule,
    DeviceModule,
    UserModule,
    MongooseModule.forFeature(
      [
        {
          name: DB_COLLECTION.TOKEN,
          schema: TokenSchema,
        },
      ],
      DB_CONNECTION.PLAYGROUND,
    ),
    //
  ],
  controllers: [TokenController],
  providers: [TokenRepository, JwtService, ...PROVIDERS],
  exports: [...PROVIDERS],
})
export class TokenModule {}
