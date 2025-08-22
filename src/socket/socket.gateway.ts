import appConfig from "@config/app.config";
import { Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JsonWebTokenService } from "src/modules/token/services/json-web-token.service";
import { SOCKET_EVENT, SOCKET_NAMESPACE } from "./socket.enum";

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: SOCKET_NAMESPACE.CHAT,
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jsonWebTokenService: JsonWebTokenService,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();

  get clientCount(): number {
    return this.clients.size;
  }

  afterInit() {
    const url = `${this.config.url}/${SOCKET_NAMESPACE.CHAT}`;
    console.log(`[socket] gateway is listening at: ${url}`);
  }

  async handleConnection(client: Socket) {
    // 1. Check if the request contains an access token
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("[socket] not found access token:");
      client.disconnect(true);
      return;
    }

    // 2. Verify the access token
    const token: string = authHeader.split(" ")[1];
    const { error, data } = await this.jsonWebTokenService.verifyToken(token, "access");
    if (error || !data?.userId) {
      console.error("[socket] connection refused:", error?.message ?? error);
      client.disconnect(true);
      return;
    }

    // 3. Remove the existing connection (if any) and store the new one
    const { userId } = data;
    if (this.clients.has(userId)) {
      const oldClient = this.clients.get(userId);
      oldClient?.disconnect(true);
      this.clients.delete(userId);
    }
    this.clients.set(userId, client);
    console.log(`[socket] +1 connection: ${client.id} userId=${userId}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.clients.entries()) {
      if (socket.id === client.id) {
        this.clients.delete(userId);
        break;
      }
    }
    console.log(`[socket] -1 connection: ${client.id} (${this.clientCount})`);
  }

  sendToUser(userId: string, event: SOCKET_EVENT, payload: any) {
    const client = this.clients.get(userId);
    if (client) {
      return client.emit(event, payload);
    }
  }

  broadcast(event: SOCKET_EVENT, payload: any) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage("message")
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`[socket] received data from ${client.id}}`, data);
  }
}
