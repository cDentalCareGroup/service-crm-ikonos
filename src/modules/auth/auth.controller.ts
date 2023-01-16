import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDTO, SaveTokenDTO } from './models/dto/login.dto';
import { UserResponse } from './models/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDTO })
  async login(@Body() body: LoginDTO): Promise<UserResponse> {
    return this.authService.login(body);
  }

  @Post('token')
  async saveToken(@Body() body: SaveTokenDTO) {
    return this.authService.saveToken(body);
  }
  @Get('test')
  async test() {
    return this.authService.test();
  }
}
