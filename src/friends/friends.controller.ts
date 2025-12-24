import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  //POST /friends/request/:userId
  @Post('request/:userId')
  sendRequest(@Param('userId') receiverId: string, @CurrentUser() user) {
    return this.friendsService.sendRequest(user.userId, receiverId);
  }

  // GET /friends/requests
  @Get('requests')
  getRequests(@CurrentUser() user) {
    return this.friendsService.getPendingRequests(user.userId);
  }

  @Get('requests/me')
  getMyRequests(@CurrentUser() user) {
    return this.friendsService.getMyPendingRequests(user.userId);
  }

  // POST /friends/respond/:requestId
  @Post('respond/:requestId')
  respond(
    @Param('requestId') requestId: string,
    @Body() dto: RespondFriendRequestDto,
    @CurrentUser() user,
  ) {
    return this.friendsService.respondToRequest(
      requestId,
      user.userId,
      dto.action,
    );
  }

  // GET /friends
  @Get()
  getFriends(@CurrentUser() user) {
    return this.friendsService.getFriends(user.userId);
  }
}
