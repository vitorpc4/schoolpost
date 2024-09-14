import { IUser } from '@/entities/interfaces/user.interface';
import { TypeUser } from '@/entities/models/user.entity';
import { UsersService } from '@/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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


        const isMatch = await bcrypt.compare(pass, user.password)

        if (!isMatch) throw new UnauthorizedException()

        const payload = { sub: user.id , userName: user.username, type: user.TypeUser, schools: user.schools }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async signUp(email:string, userName: string, pass:string){
        const user = await this.usersService.findUserByEmail(email)

        if (user) {
            throw new UnauthorizedException();
        }

        const hash = await bcrypt.hash(pass, 10)

        const u : IUser = {
            email: email,
            password: hash,
            username: userName,
            TypeUser: TypeUser.Student,
            admin: false,
            status: true,
        }

        return this.usersService.create(u)
    }
}
