import aiConfig from "@config/ai.config";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenAIProvider extends OpenAI implements OnModuleInit {
  constructor(@Inject(aiConfig.KEY) config: ConfigType<typeof aiConfig>) {
    super({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async onModuleInit() {
    try {
      const models = await this.models.list();
      console.log("[open-ai] api key valid", models.data.length);
    } catch (error: any) {
      console.error("[open-ai] invalid api key", error);
    }
  }
}
