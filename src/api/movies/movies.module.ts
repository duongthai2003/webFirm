import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';
import { MoviesController } from './movies.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [DatabaseModule.mainDbModels([MainDBModel.Movies]), CategoryModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
