import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/me
  @Get('me')
  getMe(@CurrentUser() user) {
    return this.usersService.getMe(user.userId);
  }

  // GET /users/search?q=deneme
  @Get('search')
  search(@Query('q') q: string, @CurrentUser() user) {
    return this.usersService.searchUsers(q, user.userId);
  }
}
