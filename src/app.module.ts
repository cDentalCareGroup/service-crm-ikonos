import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import typeOrmConfig from './config/type.orm.config';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mail } from './utils/mail.utils';
import { EmailController } from './modules/email/email.controller';



@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmConfig,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: mail.host,
        port: mail.port,
        secure: true,
        auth: {
          user: mail.auth.user,
          pass: mail.auth.pass
        }
      }
    })
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
