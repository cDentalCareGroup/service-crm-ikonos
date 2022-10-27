import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './models/dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './models/dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @ApiBody({ type: SignInDTO })
  async signin(@Body() body: SignInDTO) {
    return this.authService.signin(body);
  }

  @Post('login')
  @ApiBody({ type: LoginDTO })
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Get('testauth')
  @UseGuards(JwtAuthGuard)
  async test() {
    return 'working';
  }
}
