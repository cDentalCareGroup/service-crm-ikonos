import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function main() {
  const app = await NestFactory.create(AppModule,{ cors: true });

  const config = new DocumentBuilder()
    .setTitle('CRM example')
    .setDescription('The CRM API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalInterceptors(new TransformInterceptor())
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
main();
