import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      //console.log('HANDSHAKE AUTH ', client.handshake.auth);
      const token = client.handshake.auth.token;

      if (!token) {
        client.disconnect();
        console.log('token not found');
        return;
      }

      const payload = this.jwtService.verify(token);
      //console.log('JWT_PAYLOAD', payload);
      client.data.userId = payload.sub;

      //User joins to room
      client.join(`user:${payload.sub}`);

      console.log('User connected:', payload.sub);
    } catch (err) {
      console.log('JWT_VERIFY_ERROR', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected', client.data.userId);
  }

  // JOIN CONVERSATION
  @SubscribeMessage('join_conversation')
  async joinConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (
      !conversation ||
      (conversation.userAId !== userId && conversation.userBId !== userId)
    ) {
      return;
    }

    console.log('USER JOINED ROOM:', conversationId);
    client.join(conversationId);
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('EMIT TO ROOM:', data.conversationId);
    const userId = client.data.userId;

    const [message] = await this.messagesService.sendMessage(
      userId,
      data.conversationId,
      data.content,
    );

    await this.prisma.conversation.update({
      where: {
        id: data.conversationId,
      },
      data: {
        lastMessage: data.content,
        lastMessageAt: new Date(),
      },
    });

    this.server.to(data.conversationId).emit('message:new', {
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
      },
      conversation: {
        id: data.conversationId,
        lastMessage: data.content,
        lastMessageAt: message.createdAt,
      },
    });
    client.broadcast.to(data.conversationId).emit('new_message', message);
  }
}
