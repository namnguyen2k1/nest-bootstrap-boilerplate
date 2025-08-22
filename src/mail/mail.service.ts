import mailConfig from "@config/mail.config";
import { OTP_TYPE } from "@models/otp.model";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import dayjs from "dayjs";
import * as nodemailer from "nodemailer";
import {
  verify2FATemplate,
  verifyChangePasswordTemplate,
  verifyDeviceTemplate,
  verifyForgotPasswordTemplate,
  verifyRegisterTemplate,
} from "src/mail/templates";

export interface SendOtpPayload {
  email: string;
  code: number;
  username: string;
  deviceName?: string;
  type: OTP_TYPE;
  expiredAt: Date;
}

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    const { host, port, secure, auth } = this.config;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("[mail] verify error:", error);
      } else {
        console.log(`[mail] server is ready to send mail {status: ${success}}`);
      }
    });
  }

  async generateTestAccount() {
    const account: nodemailer.TestAccount = await nodemailer.createTestAccount();
    console.log("[email] test account data", account);
  }

  async sendOTP(payload: SendOtpPayload) {
    try {
      let html: string = "";
      const templateConfig = {
        code: payload.code,
        username: payload.username,
        expiredIn: dayjs(payload.expiredAt).format("DD/MM/YYYY HH:mm:ss"),
      };
      switch (payload.type) {
        case OTP_TYPE.VERIFY_REGISTER: {
          html = await verifyRegisterTemplate(templateConfig);
          break;
        }
        case OTP_TYPE.VERIFY_2FA: {
          html = await verify2FATemplate(templateConfig);
          break;
        }
        case OTP_TYPE.VERIFY_DEVICE: {
          html = await verifyDeviceTemplate({
            ...templateConfig,
            deviceName: payload?.deviceName ?? "Unknown Device",
          });
          break;
        }
        case OTP_TYPE.VERIFY_CHANGE_PASSWORD: {
          html = await verifyChangePasswordTemplate({
            ...templateConfig,
          });
          break;
        }
        case OTP_TYPE.VERIFY_FORGOT_PASSWORD: {
          html = await verifyForgotPasswordTemplate({
            ...templateConfig,
          });
          break;
        }
      }
      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: payload.email,
        subject: "NestJs Project - VERIFY OTP",
        text: `Your OTP code is: ${payload.code}`,
        html: html,
      });

      return {
        error: null,
        data: {
          reviewUrl: nodemailer.getTestMessageUrl(info),
        },
      };
    } catch (error) {
      console.log(`Failed to send email to ${payload.email}`, error);
      return { error: "Something went wrong when sending the email" };
    }
  }
}
