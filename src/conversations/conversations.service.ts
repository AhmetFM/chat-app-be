import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async creataOrGetConversation(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId)
      throw new BadRequestException("You can't chat with yourself");

    const isFriend = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: currentUserId, userBId: otherUserId },
          { userAId: otherUserId, userBId: currentUserId },
        ],
      },
    });

    if (!isFriend)
      throw new ForbiddenException('You are not friends with this user');

    //Ordering users for preventing duplicate chat.
    const [userAId, userBId] =
      currentUserId < otherUserId
        ? [currentUserId, otherUserId]
        : [otherUserId, currentUserId];

    const existingConversation = await this.prisma.conversation.findUnique({
      where: {
        userAId_userBId: {
          userAId,
          userBId,
        },
      },
    });

    if (existingConversation) return existingConversation;

    return this.prisma.conversation.create({
      data: {
        userAId,
        userBId,
      },
    });
  }

  async getMyConversation(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          {
            userAId: userId,
          },
          { userBId: userId },
        ],
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            email: true,
            aboutMe: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            email: true,
            aboutMe: true,
          },
        },
      },
    });
  }
}
