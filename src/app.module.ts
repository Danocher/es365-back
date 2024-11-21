import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { ManagerModule } from './manager/manager.module';
import { ShiftModule } from './shift/shift.module';
import * as cookieParser from 'cookie-parser'
@Module({
  imports: [AuthModule, UserModule, ClientModule, ManagerModule, ShiftModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
