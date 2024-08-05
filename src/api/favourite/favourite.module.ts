import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';

@Module({
  imports: [DatabaseModule.mainDbModels([MainDBModel.Favourite])],
  controllers: [FavouriteController],

  providers: [FavouriteService],
  exports: [FavouriteService],
})
export class FavouriteModule {}
