import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';
import { Response } from 'express';

const LoginPostSchema = z.object({
    email: z.coerce.string(),
    password: z.coerce.string()
})

const CreateAccount = z.object({
    email: z.coerce.string(),
    username: z.coerce.string(),
    password: z.coerce.string()
})

type LoginPost = z.infer<typeof LoginPostSchema>
type createAccount = z.infer<typeof CreateAccount>

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body(new ZodValidationPipe(LoginPostSchema)) {email, password}: LoginPost){
        return this.authService.signIn(email, password)
    }


    @Post('register')
    async signUp(@Body(new ZodValidationPipe(CreateAccount)) {email, username, password}: createAccount,
        @Res() response: Response
    ){
        const userCreated = await this.authService.signUp(email, username, password)
        
        return response.status(201).json({
            email: userCreated.email,
            username: userCreated.username,
            id: userCreated.id,
            type: userCreated.TypeUser
        });
    }
}
