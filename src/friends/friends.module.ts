import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, FriendsGateway],
})
export class FriendsModule {}
