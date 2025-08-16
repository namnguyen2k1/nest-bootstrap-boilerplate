import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from '@open-ai/open-ai.provider';
import {
  RequestOptions,
  SpeechCreateParams,
  Transcription,
  TranscriptionCreateParamsNonStreaming,
  Translation,
  TranslationCreateParams,
} from '@open-ai/open-ai.type';
import { getRequestOptions } from '@open-ai/utils/get-request-options';

@Injectable()
export class OpenAIAudioService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async transcription(
    body: TranscriptionCreateParamsNonStreaming<'json' | undefined>,
    options?: RequestOptions,
  ): Promise<Transcription> {
    return await this.openAI.audio.transcriptions.create(
      body,
      getRequestOptions(options),
    );
  }

  async speech(
    body: SpeechCreateParams,
    options?: RequestOptions,
  ): Promise<Buffer> {
    const result = await this.openAI.audio.speech.create(
      body,
      getRequestOptions(options),
    );
    return Buffer.from(await result.arrayBuffer());
  }

  async translation(
    body: TranslationCreateParams<'json' | undefined>,
    options?: RequestOptions,
  ): Promise<Translation> {
    return await this.openAI.audio.translations.create(
      body,
      getRequestOptions(options),
    );
  }
}
