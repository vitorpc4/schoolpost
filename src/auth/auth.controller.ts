import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';


const loginPostSchema = z.object({
    email: z.coerce.string(),
    password: z.coerce.string()
})

type LoginPost = z.infer<typeof loginPostSchema>

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body(new ZodValidationPipe(loginPostSchema)) {email, password}: LoginPost){
        return this.authService.signIn(email, password)

    }
}
