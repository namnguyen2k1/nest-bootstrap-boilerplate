export type { OpenAI } from "openai";

export type { RequestOptions } from "openai/internal/request-options";

export { LengthFinishReasonError } from "openai/error";
export {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
  ChatModel,
} from "openai/resources";
export { ParsedChatCompletion } from "openai/resources/chat/completions";

/**
 * Chat Completions
 */
export enum CHAT_ROLE {
  ASSISTANT = "assistant",
  USER = "user",
  SYSTEM = "system",
  TOOL = "tool",
}
export enum CHAT_MODEL {
  GPT_5 = "gpt-5",
  GPT_5_MINI = "gpt-5-mini",
  GPT_5_NANO = "gpt-5-nano",
  GPT_5_2025_08_07 = "gpt-5-2025-08-07",
  GPT_5_MINI_2025_08_07 = "gpt-5-mini-2025-08-07",
  GPT_5_NANO_2025_08_07 = "gpt-5-nano-2025-08-07",
  GPT_5_CHAT_LATEST = "gpt-5-chat-latest",

  GPT_4_1 = "gpt-4.1",
  GPT_4_1_MINI = "gpt-4.1-mini",
  GPT_4_1_NANO = "gpt-4.1-nano",
  GPT_4_1_2025_04_14 = "gpt-4.1-2025-04-14",
  GPT_4_1_MINI_2025_04_14 = "gpt-4.1-mini-2025-04-14",
  GPT_4_1_NANO_2025_04_14 = "gpt-4.1-nano-2025-04-14",

  O4_MINI = "o4-mini",
  O4_MINI_2025_04_16 = "o4-mini-2025-04-16",

  O3 = "o3",
  O3_2025_04_16 = "o3-2025-04-16",
  O3_MINI = "o3-mini",
  O3_MINI_2025_01_31 = "o3-mini-2025-01-31",

  O1 = "o1",
  O1_2024_12_17 = "o1-2024-12-17",
  O1_PREVIEW = "o1-preview",
  O1_PREVIEW_2024_09_12 = "o1-preview-2024-09-12",
  O1_MINI = "o1-mini",
  O1_MINI_2024_09_12 = "o1-mini-2024-09-12",

  GPT_4O = "gpt-4o",
  GPT_4O_2024_11_20 = "gpt-4o-2024-11-20",
  GPT_4O_2024_08_06 = "gpt-4o-2024-08-06",
  GPT_4O_2024_05_13 = "gpt-4o-2024-05-13",

  GPT_4O_AUDIO_PREVIEW = "gpt-4o-audio-preview",
  GPT_4O_AUDIO_PREVIEW_2024_10_01 = "gpt-4o-audio-preview-2024-10-01",
  GPT_4O_AUDIO_PREVIEW_2024_12_17 = "gpt-4o-audio-preview-2024-12-17",
  GPT_4O_AUDIO_PREVIEW_2025_06_03 = "gpt-4o-audio-preview-2025-06-03",

  GPT_4O_MINI_AUDIO_PREVIEW = "gpt-4o-mini-audio-preview",
  GPT_4O_MINI_AUDIO_PREVIEW_2024_12_17 = "gpt-4o-mini-audio-preview-2024-12-17",

  GPT_4O_SEARCH_PREVIEW = "gpt-4o-search-preview",
  GPT_4O_MINI_SEARCH_PREVIEW = "gpt-4o-mini-search-preview",
  GPT_4O_SEARCH_PREVIEW_2025_03_11 = "gpt-4o-search-preview-2025-03-11",
  GPT_4O_MINI_SEARCH_PREVIEW_2025_03_11 = "gpt-4o-mini-search-preview-2025-03-11",

  CHATGPT_4O_LATEST = "chatgpt-4o-latest",
  CODEX_MINI_LATEST = "codex-mini-latest",

  GPT_4O_MINI = "gpt-4o-mini",
  GPT_4O_MINI_2024_07_18 = "gpt-4o-mini-2024-07-18",

  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4_TURBO_2024_04_09 = "gpt-4-turbo-2024-04-09",
  GPT_4_0125_PREVIEW = "gpt-4-0125-preview",
  GPT_4_TURBO_PREVIEW = "gpt-4-turbo-preview",
  GPT_4_1106_PREVIEW = "gpt-4-1106-preview",
  GPT_4_VISION_PREVIEW = "gpt-4-vision-preview",

  GPT_4 = "gpt-4",
  GPT_4_0314 = "gpt-4-0314",
  GPT_4_0613 = "gpt-4-0613",
  GPT_4_32K = "gpt-4-32k",
  GPT_4_32K_0314 = "gpt-4-32k-0314",
  GPT_4_32K_0613 = "gpt-4-32k-0613",

  GPT_3_5_TURBO = "gpt-3.5-turbo",
  GPT_3_5_TURBO_16K = "gpt-3.5-turbo-16k",
  GPT_3_5_TURBO_0301 = "gpt-3.5-turbo-0301",
  GPT_3_5_TURBO_0613 = "gpt-3.5-turbo-0613",
  GPT_3_5_TURBO_1106 = "gpt-3.5-turbo-1106",
  GPT_3_5_TURBO_0125 = "gpt-3.5-turbo-0125",
  GPT_3_5_TURBO_16K_0613 = "gpt-3.5-turbo-16k-0613",
}
export enum FINISH_REASON {
  STOP = "stop", // model stopped naturally or encountered a stop sequence
  LENGTH = "length", // reached max tokens
  CONTENT_FILTER = "content_filter", // filtered out by content filters
  TOOL_CALLS = "tool_calls", // model invoked a tool
  FUNCTION_CALL = "function_call", // (deprecated) model invoked a function
}

/**
 * Assistants
 */
export {
  AssistantStream,
  RunCreateParamsBaseStream,
  RunSubmitToolOutputsParamsStream,
} from "openai/lib/AssistantStream";
export { ChatModel as AssistantModel } from "openai/resources";
export {
  Assistant,
  AssistantCreateParams,
  AssistantDeleted,
  AssistantListParams,
  AssistantUpdateParams,
  AssistantsPage,
} from "openai/resources/beta";
export {
  Run,
  RunCreateParamsNonStreaming,
  RunSubmitToolOutputsParamsNonStreaming,
} from "openai/resources/beta/threads";

/**
 * Images
 */
export {
  ImageCreateVariationParams,
  ImageEditParams,
  ImageGenerateParams,
  ImagesResponse,
} from "openai/resources";

/**
 * Fine Tuning
 */
export {
  FineTuningJob,
  FineTuningJobEventsPage,
  FineTuningJobsPage,
  JobCreateParams,
  JobListEventsParams,
  JobListParams,
} from "openai/resources/fine-tuning/jobs/jobs";

/**
 * Fine
 */
export { FileCreateParams, FileObject } from "openai/resources";

/**
 * Embedding
 */
export { Embedding, EmbeddingCreateParams, EmbeddingModel } from "openai/resources";

/**
 * Audio
 */
export { AudioModel } from "openai/resources";
export {
  SpeechCreateParams,
  SpeechModel,
  Transcription,
  TranscriptionCreateParamsNonStreaming,
  Translation,
  TranslationCreateParams,
} from "openai/resources/audio";

export enum ASSISTANT_TOOL_TYPE {
  CODE_INTERPRETER = "code_interpreter",
  FILE_SEARCH = "file_search",
  FUNCTION_TOOL = "function",
}

export enum TTS_MODEL {
  // https://platform.openai.com/docs/models#tts
  TTS_1 = "tts-1", // Latest text-to-speech model, optimized for speed.
  TTS_1_HD = "tts-1-hd", // Latest text-to-speech model, optimized for quality.
}

export enum TRANSCRIPTION_MODEL {
  // https://platform.openai.com/docs/models#whisper
  // Supported languages: https://platform.openai.com/docs/guides/text-to-speech#supported-languages
  WHISPER = "whisper-1",
}

export enum SPEECH_VOICE {
  // https://platform.openai.com/docs/guides/text-to-speech#voice-options
  ALLOY = "alloy",
  ECHO = "echo",
  FABLE = "fable",
  ONYX = "onyx",
  NOVA = "nova",
  SHIMMER = "shimmer",
}

export enum IMAGE_MODEL {
  DALL_E_3 = "dall-e-3", // Latest DALL·E model released Nov 2023 (https://openai.com/index/new-models-and-developer-products-announced-at-devday/)
  DALL_E_2 = "dall-e-2", // Previous DALL·E model released Nov 2022, more realistic/accurate and 4x higher resolution than the original.
}

export enum RUN_STATUS {
  // https://platform.openai.com/docs/assistants/deep-dive#run-lifecycle

  // When Runs are first created or when you complete the required_action, they move to `queued`. They should almost immediately move to `in_progress`.
  QUEUED = "queued",

  // While `in_progress`, the Assistant uses the model and tools to perform steps.
  IN_PROGRESS = "in_progress",

  // When using Function calling, the Run moves to `requires_action` once the model determines the functions and arguments to call. You must run those functions and submit outputs before it can proceed. If not submitted before expires_at (~10 mins), the run moves to `expired`.
  REQUIRES_ACTION = "requires_action",

  // Happens when outputs are not submitted before expires_at or the run exceeds allowed time. The run expires.
  EXPIRED = "expired",

  // You can attempt to cancel an `in_progress` run. Once successful, the status moves to `cancelled`. Cancellation is attempted but not guaranteed.
  CANCELLING = "cancelling",

  // Run was successfully cancelled.
  CANCELLED = "cancelled",

  // You can view the reason in `last_error`. Failure timestamp is recorded in `failed_at`.
  FAILED = "failed",

  // Run ended due to hitting `max_prompt_tokens` or `max_completion_tokens`. Details are in `incomplete_details`.
  INCOMPLETE = "incomplete",

  // Run completed successfully. You can now view all messages and steps taken. You can continue the conversation by adding more user messages and creating another Run.
  COMPLETED = "completed",
}

export enum RUN_EVENT {
  CALL_START = "callStart",
  CALL_DONE = "callDone",
  MESSAGE_CREATED = "messageCreated",
  MESSAGE_DELTA = "messageDelta",
  MESSAGE_DONE = "messageDone",
  TEXT_CREATED = "textCreated",
  TEXT_DELTA = "textDelta",
  TEXT_DONE = "textDone",
  IMAGE_FILE_DONE = "imageFileDone",
  TOOL_CALL_CREATED = "toolCallCreated",
  TOOL_CALL_DELTA = "toolCallDelta",
  TOOL_CALL_DONE = "toolCallDone",
  RUN_STEP_CREATED = "runStepCreated",
  RUN_STEP_DELTA = "runStepDelta",
  RUN_STEP_DONE = "runStepDone",
}

export enum RUN_EVENT_STREAM {
  THREAD_CREATED = "thread.created", // data is a Thread - occurs when a new thread is created.
  THREAD_RUN_CREATED = "thread.run.created", // data is a Run - occurs when a new run is created.
  THREAD_RUN_QUEUED = "thread.run.queued", // data is a Run - occurs when a run moves to queued.
  THREAD_RUN_IN_PROGRESS = "thread.run.in_progress", // data is a Run - occurs when a run moves to in_progress.
  THREAD_RUN_REQUIRES_ACTION = "thread.run.requires_action", // data is a Run - occurs when a run requires action.
  THREAD_RUN_COMPLETED = "thread.run.completed", // data is a Run - occurs when a run is completed.
  THREAD_RUN_INCOMPLETE = "thread.run.incomplete", // data is a Run - occurs when a run ends with status incomplete.
  THREAD_RUN_FAILED = "thread.run.failed", // data is a Run - occurs when a run fails.
  THREAD_RUN_CANCELLING = "thread.run.cancelling", // data is a Run - occurs when a run is cancelling.
  THREAD_RUN_CANCELLED = "thread.run.cancelled", // data is a Run - occurs when a run is cancelled.
  THREAD_RUN_EXPIRED = "thread.run.expired", // data is a Run - occurs when a run expires.
  THREAD_RUN_STEP_CREATED = "thread.run.step.created", // data is a Run Step - occurs when a run step is created.
  THREAD_RUN_STEP_IN_PROGRESS = "thread.run.step.in_progress", // data is a Run Step - occurs when a run step is in progress.
  THREAD_RUN_STEP_DELTA = "thread.run.step.delta", // data is a Run Step - occurs when parts of a run step are being streamed.
  THREAD_RUN_STEP_COMPLETED = "thread.run.step.completed", // data is a Run Step - occurs when a run step is completed.
  THREAD_RUN_STEP_FAILED = "thread.run.step.failed", // data is a Run Step - occurs when a run step fails.
  THREAD_RUN_STEP_CANCELLED = "thread.run.step.cancelled", // data is a Run Step - occurs when a run step is cancelled.
  THREAD_RUN_STEP_EXPIRED = "thread.run.step.expired", // data is a Run Step - occurs when a run step expires.
  THREAD_MESSAGE_CREATED = "thread.message.created", // data is a Message - occurs when a message is created.
  THREAD_MESSAGE_IN_PROGRESS = "thread.message.in_progress", // data is a Message - occurs when a message is in progress.
  THREAD_MESSAGE_DELTA = "thread.message.delta", // data is a Message - occurs when parts of a message are being streamed.
  THREAD_MESSAGE_COMPLETED = "thread.message.completed", // data is a Message - occurs when a message is completed.
  THREAD_MESSAGE_INCOMPLETE = "thread.message.incomplete", // data is a Message - occurs when a message ends before completed.
  ERROR = "error", // data is an error - occurs when an error happens (server error, timeout, etc).
  DONE = "done", // data is [DONE] - occurs when the stream ends.
}
