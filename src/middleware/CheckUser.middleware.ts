import { env } from '@/env';
import { UsersService } from '@/services/user.service';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { GlobalTokenService } from '@/shared/globalTokenService';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class CheckUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly globalTokenService: GlobalTokenService,
  ) {}

  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    if (req.headers.authorization) {
      var authorization = req.headers.authorization.split(' ')[1];

      const decoded = await this.jwtService.verifyAsync(authorization, {
        secret: env.JWT_SECRET,
      });

      this.globalTokenService.setDecodedToken(decoded);

      next();
      return;
    }

    return res.status(403).json({ message: 'Não autorizado' });
  }
}
