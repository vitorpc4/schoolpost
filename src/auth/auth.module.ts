import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/env';
import { UsersModule } from '@/users/users.module';
import { UserSchoolAssociationModule } from '@/user-school-association/user-school-association.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    UserSchoolAssociationModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_IN }
    })
  ]
})
export class AuthModule {}
