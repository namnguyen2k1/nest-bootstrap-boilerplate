export enum SSE_TYPE {
  NOTIFICATION = "NOTIFICATION",
  SYSTEM = "SYSTEM",
  HEARTBEAT = "HEARTBEAT",
  MAINTENANCE = "MAINTENANCE",
}

export interface SsePayload {
  readonly type: SSE_TYPE;
  readonly userId?: string;
  readonly data?: any;
  readonly timestamp?: number | string;
}
