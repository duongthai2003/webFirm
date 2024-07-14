import { Controller, Module } from '@nestjs/common';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule.mainDbModels([MainDBModel.User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class userModule {}
