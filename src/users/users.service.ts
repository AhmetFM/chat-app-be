import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        createdAt: true,
        aboutMe: true,
      },
    });
  }

  update(currentUserId: string, body: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: currentUserId },
      data: body,
    });
  }

  searchUsers(query: string, currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        aboutMe: true,
        receivedFriendRequests: true,
        sentFriendRequests: true,
      },
    });
  }
}
