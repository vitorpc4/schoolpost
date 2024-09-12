import { UsersService } from '@/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService:JwtService
    ){}

    async signIn(email:string, pass:string) : Promise<{access_token: string}>{
        const user = await this.usersService.findUserByEmail(email)
        if(!user){
            throw new UnauthorizedException()
        }
        if(user.password !== pass){
            throw new UnauthorizedException()
        }

        const payload = { sub: user.id , userName: user.username, type: user.TypeUser}

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
