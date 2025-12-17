import { IsOptional, IsUUID } from 'class-validator';

export class GetMessagesDto {
  @IsUUID()
  conversationId: string;

  @IsOptional()
  cursor?: string;
}
