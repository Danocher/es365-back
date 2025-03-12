import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    //Add your origins here
    origin: ['http://localhost:3000', 'https://es365-frontend.vercel.app'],
    credentials: true,
    exposedHeaders: `set-cookie`

  });
  // console.log(process.env.PORT)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
