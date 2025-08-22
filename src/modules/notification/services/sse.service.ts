import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { SsePayload } from "./sse.type";

@Injectable({})
export class SseService {
  private readonly global$ = new Subject<SsePayload>();
  private readonly users = new Map<string, Subject<SsePayload>>();

  getGlobalStream() {
    return this.global$.asObservable();
  }

  publishGlobal(event: SsePayload) {
    this.global$.next(event);
    return { data: this.users.size };
  }

  getUserStream(userId: string) {
    let subject = this.users.get(userId);
    if (!subject) {
      subject = new Subject<SsePayload>();
      this.users.set(userId, subject);
    }
    return subject.asObservable();
  }

  publishToUser(userId: string, event: SsePayload) {
    const subject = this.users.get(userId);
    if (!subject) {
      return { error: true };
    }
    subject.next(event);
    return { error: false };
  }
}
