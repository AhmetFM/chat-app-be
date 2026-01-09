import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from 'generated/prisma/enums';

export class FriendRequestDto {
  @ApiProperty({
    description: 'The id of the friend request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The id of the sender',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  senderId: string;

  @ApiProperty({
    description: 'The id of the receiver',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receiverId: string;

  @ApiProperty({
    description: 'The status of the friend request',
    enum: FriendRequestStatus,
    example: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;

  @ApiProperty({
    description: 'The date when the friend request was created',
    example: '2026-01-09T13:05:14.915Z',
  })
  createdAt: Date;
}
