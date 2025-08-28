import { Injectable } from "@nestjs/common";
import { CHAT_MODEL, CHAT_ROLE, ChatCompletion, FINISH_REASON } from "@open-ai/open-ai.type";
import { OpenAIChatCompletionService } from "@open-ai/services/chat-completion/chat-completion.service";
import { formatObj } from "@shared/utils/format-object";
import { toObjectId } from "@shared/utils/to-object-id";
import { AnyObject } from "mongoose";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
  ChatCompletionToolMessageParam,
} from "openai/resources";
import { MessageRepository } from "src/modules/assistant/repositories/message.repository";
import { ToolCallService } from "src/modules/assistant/services/tool-call.service";
import { AskAssistantDto } from "../dto/ask-assistant.dto";
import { Message } from "../models/message.model";

@Injectable()
export class MessageService {
  constructor(
    private readonly openAIChatCompletion: OpenAIChatCompletionService,
    private readonly messageRepo: MessageRepository,
    private readonly toolService: ToolCallService,
  ) {}

  async askAssistant(dto: AskAssistantDto) {
    // 1 find existed messages
    const { conversationId, model = CHAT_MODEL.GPT_4O, question } = dto;
    const history = await this.messageRepo.findAll({
      conversationId: toObjectId(conversationId),
      role: {
        $in: [CHAT_ROLE.USER, CHAT_ROLE.ASSISTANT],
      },
    });

    let systemMessage: any = await this.messageRepo.findOne({
      conversationId: toObjectId(conversationId),
      role: {
        $in: [CHAT_ROLE.SYSTEM],
      },
    });
    if (!systemMessage) {
      systemMessage = {
        role: CHAT_ROLE.SYSTEM,
        content: [
          {
            type: "text",
            text: "Ban la tro ly thuoc du an NestJs Bootstrap Boilerplate.",
          },
          {
            type: "text",
            text: "Ban co the tra loi moi cau hoi ve du an nay.",
          },
        ],
      } as ChatCompletionMessageParam;
      await this.messageRepo.create({
        conversationId: toObjectId(conversationId),
        role: systemMessage.role,
        content: systemMessage.content,
        model,
        sessionId: Date.now(),
      });
    }

    // 2. mapping message params
    const messages: ChatCompletionMessageParam[] = [
      {
        role: systemMessage.role,
        content: systemMessage.content,
      },
      ...history.map((m) => {
        return {
          role: m.role,
          content: m.content,
        } as ChatCompletionMessageParam;
      }),
      {
        role: CHAT_ROLE.USER,
        content: question,
      },
    ];

    // 3. Call OpenAI chat-completion
    const { responses, latency } = await this.createChatCompletionMessage({
      listMessages: messages,
      options: { model },
    });

    // 4. Save messages to DB (user + assistant messages)
    const sessionId: number = Date.now();
    await this.messageRepo.create({
      conversationId: toObjectId(conversationId),
      role: CHAT_ROLE.USER,
      content: question,
      model,
      sessionId,
    });
    for (const res of responses) {
      console.log("[gpt] res:", formatObj(res));
      const message = res.choices[0].message;
      const { role, content, tool_calls } = message;
      const { usage, choices, model, id } = res;
      const lastAssistant = role === "assistant" && !tool_calls;
      const toolMs = tool_calls ? latency.tool.find((t) => t.id === tool_calls[0].id)?.time : 0;
      const data: Partial<Message> = {
        conversationId: toObjectId(conversationId),
        role: role as CHAT_ROLE,
        content: content ?? "",
        model: model as any,
        sessionId: sessionId,
        chatCompletion: res,
        chatCompletionId: id,
        finishReason: choices[0].finish_reason,
        token: {
          completionTokens: usage?.completion_tokens,
          completionTokensDetails: usage?.completion_tokens_details,
          promptTokens: usage?.prompt_tokens,
          promptTokensDetails: usage?.prompt_tokens_details,
          totalTokens: usage?.total_tokens,
        },
        latencyMs: lastAssistant ? latency.total : toolMs,
        toolCall: tool_calls as any,
      };
      await this.messageRepo.create(data);
    }

    // 5. Return last assistant message
    const assistantMsg = responses
      .reverse()
      .find((res) => res.choices[0].message.role === "assistant");
    return assistantMsg?.choices[0].message ?? null;
  }

  private async handleCallTool(toolCall: ChatCompletionMessageToolCall) {
    const name = (toolCall as any)?.function?.name;
    const args: AnyObject = JSON.parse((toolCall as any)?.function?.arguments);
    console.log(`[gpt] tool call:`, name, args);

    const result = await this.toolService.excuseTool({
      toolName: name,
      payload: args,
    });

    const toolMessage: ChatCompletionToolMessageParam = {
      role: "tool",
      content: JSON.stringify(result),
      tool_call_id: toolCall.id,
    };
    console.log(`[gpt] tool result: `, result, toolMessage);

    return {
      toolMessage,
      toolCallResult: result,
    };
  }

  async createChatCompletionMessage({
    listMessages,
    options,
  }: {
    options: {
      model: CHAT_MODEL;
    };
    listMessages: ChatCompletionMessageParam[];
  }) {
    const model = options.model;
    const messages: ChatCompletionMessageParam[] = JSON.parse(JSON.stringify(listMessages));
    const tools: ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "getProjectFeature",
          description: "get all features of NestJs Bootstrap Boilerplate theo domain",
          parameters: {
            type: "object",
            properties: {
              domain: {
                type: "string",
                description: "feature domain name (auth, security, ai,...)",
              },
            },
            required: ["domain"],
          },
        },
      },
    ];

    const responses: ChatCompletion[] = [];
    const toolMs: {
      id: string;
      time: number;
    }[] = [];
    let reason: FINISH_REASON | null = null;
    console.log("[gpt] start request...");
    const start = performance.now();
    while (!reason || ![FINISH_REASON.LENGTH, FINISH_REASON.STOP].includes(reason)) {
      const body: ChatCompletionCreateParamsNonStreaming = {
        model,
        messages,
        max_completion_tokens: 15000,
        temperature: 0.6,
        tools,
        store: true,
        tool_choice: "auto",
        parallel_tool_calls: false,
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
      };

      console.time(`[gpt] create-completion-time`);
      const response = await this.openAIChatCompletion.create(body);
      console.timeEnd(`[gpt] create-completion-time`);
      console.log("[gpt] response", formatObj(response));
      responses.push(response);
      const choices = response.choices[0];
      reason = choices?.finish_reason as FINISH_REASON;
      console.log("[gpt] finish reason", reason);
      console.log("[gpt] token_usage", formatObj(response.usage));

      switch (reason) {
        case FINISH_REASON.TOOL_CALLS: {
          console.time(`[gpt] tool-call total time`);
          const { message } = choices;
          console.log(`[tool-call] message:`, formatObj(message));
          const { tool_calls: toolCalls } = message;
          console.log("[gpt] tool-calls", toolCalls);
          if (toolCalls?.length) {
            messages.push(message);

            for (let i = 0; i < toolCalls.length; i++) {
              const toolCall = toolCalls[i];

              const startTool = performance.now();
              const { toolMessage } = await this.handleCallTool(toolCall);

              const endTool = performance.now();
              toolMs.push({
                id: toolMessage.tool_call_id,
                time: endTool - startTool,
              });

              messages.push(toolMessage);
              responses.push({
                ...response,
                choices: [
                  {
                    message: {
                      ...toolMessage,
                      tool_calls: [toolCall],
                    } as ChatCompletionMessageParam,
                  },
                ],
              } as ChatCompletion);
            }
          }
          console.timeEnd(`[gpt] tool-call total time`);
          break;
        }

        case FINISH_REASON.LENGTH:
        case FINISH_REASON.CONTENT_FILTER:
        case FINISH_REASON.STOP: {
          const message = response.choices[0]?.message;
          console.log(`[gpt] finish-reason [${reason}]`, formatObj(message));
          break;
        }
        default: {
          const message = response.choices[0]?.message;
          console.log(`[gpt] unexpected-case `, formatObj(message));
          break;
        }
      }
    }

    const end = performance.now();
    const latency = {
      total: end - start,
      tool: toolMs,
    };

    return { responses, latency };
  }
}
