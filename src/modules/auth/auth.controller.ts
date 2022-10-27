import {  Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './models/dto/create-user.dto';
import { ApiBody, ApiTags} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("signin")
    @ApiBody({ type: CreateUserDTO})
    async createUser(@Body() body: CreateUserDTO) {
        return this.authService.createUser(body);
    } 
}
