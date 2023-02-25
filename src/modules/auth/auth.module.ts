import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from './models/entities/user.entity';
import { RolEntity, UserRolEntity } from './models/entities/rol.entity';
import { UserLogsEntity } from './models/entities/user.logs.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity,RolEntity, UserRolEntity, UserLogsEntity]),
    JwtModule.register({
      secret: process.env.CRM_TOKEN_SECRET,
      signOptions: { expiresIn: '18h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
