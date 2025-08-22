import { Module } from "@nestjs/common";
import { OpenAIProvider } from "./open-ai.provider";
import { OpenAIAssistantService } from "./services/assistant/assistant.service";
import { OpenAIRunService } from "./services/assistant/run.service";
import { OpenAIAudioService } from "./services/audio/audio.service";
import { OpenAIChatCompletionService } from "./services/chat-completion/chat-completion.service";
import { OpenAIEmbeddingService } from "./services/embedding/embedding.service";
import { OpenAIFineTuningService } from "./services/fire-turning/fine-tuning.service";
import { OpenAIImageService } from "./services/image/image.service";

export const PROVIDERS = [
  OpenAIProvider,
  OpenAIImageService,
  OpenAIFineTuningService,
  OpenAIEmbeddingService,
  OpenAIChatCompletionService,
  OpenAIAudioService,
  OpenAIAssistantService,
  OpenAIRunService,
];

@Module({
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class OpenAIModule {}
