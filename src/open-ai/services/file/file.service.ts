import { Injectable } from "@nestjs/common";
import { OpenAIProvider } from "@open-ai/open-ai.provider";
import { FileCreateParams, FileObject, RequestOptions } from "@open-ai/open-ai.type";
import { getRequestOptions } from "@open-ai/utils/get-request-options";

@Injectable()
export class OpenAIAssistantFileService {
  constructor(private readonly openAI: OpenAIProvider) {}

  async create(body: FileCreateParams, options?: RequestOptions): Promise<FileObject> {
    return await this.openAI.files.create(body, getRequestOptions(options));
  }

  async retrieve(fileId: string, options?: RequestOptions): Promise<FileObject> {
    return await this.openAI.files.retrieve(fileId, getRequestOptions(options));
  }
}
