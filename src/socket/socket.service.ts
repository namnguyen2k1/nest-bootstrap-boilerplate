import { Injectable } from '@nestjs/common';
import { SendEventDto } from './send-event.dto';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly gateway: SocketGateway) {}

  sendToUser(userId: string, payload: SendEventDto) {
    this.gateway.sendToUser(userId, payload.type, payload.data);
  }

  sendToAll(payload: SendEventDto) {
    this.gateway.broadcast(payload.type, payload.data);
  }

  getConnectedCount() {
    return this.gateway.clientCount;
  }
}
