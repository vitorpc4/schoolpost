import { IUser } from '@/entities/interfaces/user.interface';
import { UsersService } from '@/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSchoolAssociationService } from './userSchoolAssociation.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private usersSchoolAssociationService: UserSchoolAssociationService,
        private jwtService:JwtService
    ){}

    async signIn(email:string, pass:string) : Promise<{access_token: string}>{
        const user = await this.usersService.findUserByEmail(email)
        if(!user){
            throw new UnauthorizedException()
        }


        const isMatch = await bcrypt.compare(pass, user.password)

        if (!isMatch) throw new UnauthorizedException()
        
        const schools = await this.usersSchoolAssociationService.findAllByUserId(user.id)
        
        let payload = { sub: user.id, userName: user.username, schools: [] }

        if (schools.length > 0) {
            payload = { sub: user.id, userName: user.username, schools: schools.map(s => s.school.id) }
        }

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
            status: true,
        }

        return this.usersService.create(u)
    }
}
