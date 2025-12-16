import { IsEnum } from 'class-validator';

export enum FriendRequestAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export class RespondFriendRequestDto {
  @IsEnum(FriendRequestAction)
  action: FriendRequestAction;
}
