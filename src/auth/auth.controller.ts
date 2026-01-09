import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/auth-response.dto';
import { RegisterErrorResponse } from './dto/register-error-response.dto';
import { LoginErrorResponse } from './dto/login-error-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Email already in use',
    type: RegisterErrorResponse,
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiCreatedResponse({
    description: 'User logged in successfully',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: LoginErrorResponse,
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCreatedResponse({
    description: 'Access token refreshed successfully',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    type: LoginErrorResponse,
  })
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}
