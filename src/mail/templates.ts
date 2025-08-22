import * as ejs from "ejs";
import { join } from "path";

interface VerifyOTP {
  code: number;
  expiredIn: string;
}

interface VerifyRegister extends VerifyOTP {
  username: string;
}

interface Verify2FA extends VerifyOTP {
  username: string;
}

interface VerifyDevice extends VerifyOTP {
  username: string;
  deviceName: string;
}

interface VerifyChangePassword extends VerifyOTP {
  username: string;
}

interface VerifyForgotPassword extends VerifyOTP {
  username: string;
}

const templateFolderName: string = "templates";

export async function verifyRegisterTemplate(payload: VerifyRegister): Promise<string> {
  return await ejs.renderFile(join(__dirname, templateFolderName, "verify-register.ejs"), {
    code: payload.code,
    expiredIn: payload.expiredIn,
    username: payload.username,
    year: new Date().getFullYear(),
  });
}

export async function verify2FATemplate(payload: Verify2FA): Promise<string> {
  return await ejs.renderFile(join(__dirname, templateFolderName, "verify-2fa.ejs"), {
    code: payload.code,
    expiredIn: payload.expiredIn,
    username: payload.username,
    year: new Date().getFullYear(),
  });
}

export async function verifyDeviceTemplate(payload: VerifyDevice): Promise<string> {
  return await ejs.renderFile(join(__dirname, templateFolderName, "verify-device.ejs"), {
    code: payload.code,
    expiredIn: payload.expiredIn,
    username: payload.username,
    deviceName: payload.deviceName,
    year: new Date().getFullYear(),
  });
}

export async function verifyChangePasswordTemplate(payload: VerifyChangePassword): Promise<string> {
  return await ejs.renderFile(join(__dirname, templateFolderName, "verify-change-password.ejs"), {
    code: payload.code,
    expiredIn: payload.expiredIn,
    username: payload.username,
    year: new Date().getFullYear(),
  });
}

export async function verifyForgotPasswordTemplate(payload: VerifyForgotPassword): Promise<string> {
  return await ejs.renderFile(join(__dirname, templateFolderName, "verify-forgot-password.ejs"), {
    code: payload.code,
    expiredIn: payload.expiredIn,
    username: payload.username,
    year: new Date().getFullYear(),
  });
}
