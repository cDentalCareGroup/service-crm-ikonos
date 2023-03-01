import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDTO, SaveTokenDTO, UpdatePasswordDTO } from './models/dto/login.dto';
import { UserResponse } from './models/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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

  @Get('logs')
  async getUserLogs() {
    return this.authService.getUserLogs();
  }

  @Post('update/password')
  @ApiBody({ type: UpdatePasswordDTO })
  async updatePassword(@Body() body: UpdatePasswordDTO) {
    return this.authService.updatePassword(body);
  }
}
