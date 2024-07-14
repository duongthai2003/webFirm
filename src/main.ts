import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useSwagger } from './swagger';
import { useLogger } from 'logger';
import { userModule } from './api/user/user.module';
import { ResponseInterceptor } from './response/response.interceptor';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (process.env.ENABLE_SWAGGER) {
    useSwagger(app, [userModule, AuthModule]);
  }
  // log request
  useLogger(app);

  /// accesss cors polyci
  app.enableCors({});

  // custom data tra ve
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
