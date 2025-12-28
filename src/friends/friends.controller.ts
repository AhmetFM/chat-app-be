import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';
import { FriendsGateway } from './friends.gateway';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(
    private friendsService: FriendsService,
    private friendsGateway: FriendsGateway,
  ) {}

  //POST /friends/request/:userId
  @Post('request/:userId')
  async sendRequest(@Param('userId') receiverId: string, @CurrentUser() user) {
    const request = await this.friendsService.sendRequest(
      user.userId,
      receiverId,
    );
    this.friendsGateway.emitFriendRequestCreated(request);
    return request;
  }

  // GET /friends/requests
  @Get('requests')
  getRequests(@CurrentUser() user) {
    return this.friendsService.getPendingRequests(user.userId);
  }

  @Get('requests/me')
  getOutgoingRequests(@CurrentUser() user) {
    return this.friendsService.getMyPendingRequests(user.userId);
  }

  // POST /friends/respond/:requestId
  @Post('respond/:requestId')
  async respond(
    @Param('requestId') requestId: string,
    @Body() dto: RespondFriendRequestDto,
    @CurrentUser() user,
  ) {
    const result = await this.friendsService.respondToRequest(
      requestId,
      user.userId,
      dto.action,
    );

    if (dto.action === 'REJECT') {
      this.friendsGateway.emitFriendRequestRejected({
        requestId,
        senderId: result.senderId,
        receiverId: result.receiverId,
      });
    }

    if (dto.action === 'ACCEPT') {
      this.friendsGateway.emitFriendRequestAccepted({
        senderId: result.senderId,
        receiverId: result.receiverId,
        sender: result.sender,
        receiver: result.receiver,
      });
    }

    return result;
  }

  // GET /friends
  @Get()
  getFriends(@CurrentUser() user) {
    return this.friendsService.getFriends(user.userId);
  }
}
