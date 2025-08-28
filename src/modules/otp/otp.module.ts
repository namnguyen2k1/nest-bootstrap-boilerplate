import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbModule } from "src/infrastructure/database/mongodb/mongodb.module";
import { OtpController } from "./otp.controller";
import { OTPRepository } from "./otp.repository";
import { OTPSchema } from "./otp.schema";
import { OtpService } from "./otp.service";

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature(
      [
        {
          name: DB_COLLECTION.OTP,
          schema: OTPSchema,
        },
      ],
      DB_CONNECTION.PLAYGROUND,
    ),
    //
  ],
  controllers: [OtpController],
  providers: [OTPRepository, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
