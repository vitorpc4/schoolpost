import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './DTOS/LoginDTO';
import { CreateAccountDTO } from './DTOS/CreateAccountDTO';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() { email, password }: LoginDTO) {
    return this.authService.signIn(email, password);
  }

  @Post('register')
  async signUp(
    @Body()
    { email, username, password }: CreateAccountDTO,
    @Res() response: Response,
  ) {
    const userCreated = await this.authService.signUp(
      email,
      username,
      password,
    );

    return response.status(201).json({
      email: userCreated.email,
      username: userCreated.username,
      id: userCreated.id,
    });
  }
}
