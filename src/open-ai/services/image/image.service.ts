import { Injectable } from '@nestjs/common';
import {
  ImageCreateVariationParams,
  ImageEditParams,
  ImageGenerateParams,
  ImagesResponse,
  RequestOptions,
} from '@open-ai/open-ai.type';
import { getRequestOptions } from '@open-ai/utils/get-request-options';
import { OpenAIProvider } from '../../open-ai.provider';

@Injectable()
export class OpenAIImageService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async generate(body: ImageGenerateParams, options?: RequestOptions) {
    return await this.openAI.images.generate(body, getRequestOptions(options));
  }

  async edit(body: ImageEditParams, options?: RequestOptions) {
    return await this.openAI.images.edit(body, getRequestOptions(options));
  }

  async createVariation(
    body: ImageCreateVariationParams,
    options?: RequestOptions,
  ): Promise<ImagesResponse> {
    return await this.openAI.images.createVariation(
      body,
      getRequestOptions(options),
    );
  }
}
