import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetMessagesDto } from './dto/get-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  // POST /messages
  @Post()
  sendMessage(@Body() dto: SendMessageDto, @CurrentUser() user) {
    return this.messagesService.sendMessage(
      user.userId,
      dto.conversationId,
      dto.content,
    );
  }

  // GET /messages?conversationId=xxx&cursor=xxx
  @Get()
  getMessages(@Query() query: GetMessagesDto, @CurrentUser() user) {
    return this.messagesService.getMessages(
      user.userId,
      query.conversationId,
      query.cursor,
    );
  }
}
