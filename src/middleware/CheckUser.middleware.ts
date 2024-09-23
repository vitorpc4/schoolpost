import { env } from '@/env';
import { UsersService } from '@/services/user.service';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CheckUserMiddleware implements NestMiddleware {
    constructor(
        private userSchoolAssociationRepository: UserSchoolAssociationService,
        private jwtService: JwtService
    ) {}

    async use(req: any, res: any, next: (error?: Error | any) => void) {

        if ((req.originalUrl.includes('/association/user/') && req.method === 'GET')) {
            next();
            return;
        }

        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization.split(' ')[1];

            const decoded = await this.jwtService.verifyAsync(
                authorization, 
                { 
                    secret: env.JWT_SECRET
                });

            const schoolId = req.headers['x-schoolid']

            if (!decoded.schools.includes(schoolId)) {
                return res.status(403).json({ message: 'Não autorizado' });
            }
            
            next();
            return;
        }

        return res.status(403).json({ message: 'Não autorizado' });
    }
}