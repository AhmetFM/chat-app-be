import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  createConversation(@Body() dto: CreateConversationDto, @CurrentUser() user) {
    return this.conversationsService.creataOrGetConversation(
      user.userId,
      dto.userId,
    );
  }

  @Get()
  getMyConversation(@CurrentUser() user) {
    return this.conversationsService.getMyConversation(user.userId);
  }
}
