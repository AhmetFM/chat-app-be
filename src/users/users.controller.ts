import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/me
  @Get('me')
  @ApiOperation({ summary: 'Get the current user' })
  @ApiOkResponse({ description: 'The current user', type: GetUserDto })
  getMe(@CurrentUser() user) {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user' })
  @ApiOkResponse({ description: 'The updated user', type: GetUserDto })
  updateMe(@CurrentUser() user, @Body() data: UpdateUserDto) {
    return this.usersService.update(user.userId, data);
  }

  // GET /users/search?q=deneme
  @Get('search')
  @ApiOperation({ summary: 'Search for users' })
  @ApiOkResponse({ description: 'The users', type: [SearchUserDto] })
  @ApiQuery({
    name: 'q',
    description: 'Searching user email or name includes query',
    required: false,
  })
  search(@Query('q') q: string, @CurrentUser() user) {
    return this.usersService.searchUsers(q, user.userId);
  }
}
