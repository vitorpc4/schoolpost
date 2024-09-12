import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from '@/services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/env';
import { UsersModule } from '@/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '120s' }
    })
  ]
})
export class AuthModule {}
