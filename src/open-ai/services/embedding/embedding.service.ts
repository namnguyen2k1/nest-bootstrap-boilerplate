import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from '@open-ai/open-ai.provider';
import {
  Embedding,
  EmbeddingCreateParams,
  RequestOptions,
} from '@open-ai/open-ai.type';
import { getRequestOptions } from '@open-ai/utils/get-request-options';

@Injectable()
export class OpenAIEmbeddingService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async create(
    body: EmbeddingCreateParams,
    options?: RequestOptions,
  ): Promise<Embedding[]> {
    const { data } = await this.openAI.embeddings.create(
      body,
      getRequestOptions(options),
    );
    return data;
  }
}
