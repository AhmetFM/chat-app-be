import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(userId: string, conversationId: string, content: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant =
      conversation.userAId === userId || conversation.userBId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    return this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          content,
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessage: content,
        },
      }),
    ]);
  }

  async getMessages(userId: string, conversationId: string, cursor?: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant =
      conversation.userAId === userId || conversation.userBId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    return messages;
  }
}
