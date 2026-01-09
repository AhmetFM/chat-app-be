import { FriendRequestStatus } from 'generated/prisma/enums';
import { GetUserDto } from './get-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestDto } from 'src/shared/dto/friend-request.dto';

export class SearchUserDto extends GetUserDto {
  @ApiProperty({
    description: 'The friend requests sent by the user',
    type: [FriendRequestDto],
    nullable: true,
  })
  sentFriendRequests: FriendRequestDto[];

  @ApiProperty({
    description: 'The friend requests received by the user',
    type: [FriendRequestDto],
    nullable: true,
  })
  receivedFriendRequests: FriendRequestDto[];
}
