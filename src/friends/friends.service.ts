import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new Error("You can't send a friend request to yourself");
    }

    const alreadyFriends = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: senderId, userBId: receiverId },
          { userAId: receiverId, userBId: senderId },
        ],
      },
    });

    if (alreadyFriends) {
      throw new BadRequestException('You are already friends');
    }

    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists');
    }

    return this.prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            aboutMe: true,
          },
        },
      },
    });
  }

  async getPendingRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            aboutMe: true,
          },
        },
      },
    });
  }

  async getMyPendingRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            aboutMe: true,
          },
        },
      },
    });
  }

  async respondToRequest(
    requestId: string,
    userId: string,
    action: 'ACCEPT' | 'REJECT',
  ) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new ForbiddenException('You cannot respond to this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request already handled');
    }

    if (action === 'REJECT') {
      return this.prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
        include: {
          sender: true,
          receiver: true,
        },
      });
    }

    // ACCEPT
    await this.prisma.$transaction([
      this.prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
        include: {
          sender: true,
          receiver: true,
        },
      }),
      this.prisma.friendship.create({
        data: {
          userAId: request.senderId,
          userBId: request.receiverId,
        },
      }),
    ]);

    return {
      success: true,
      senderId: request.senderId,
      receiverId: request.receiverId,
      sender: request.sender,
      receiver: request.receiver,
    };
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: true,
        userB: true,
      },
    });

    return friendships.map((f) =>
      f.userAId === userId
        ? {
            id: f.userB.id,
            name: f.userB.name,
            email: f.userB.email,
            profileImage: f.userB.profileImage,
            aboutMe: f.userB.aboutMe,
          }
        : {
            id: f.userA.id,
            name: f.userA.name,
            email: f.userA.email,
            profileImage: f.userA.profileImage,
            aboutMe: f.userA.aboutMe,
          },
    );
  }
}
