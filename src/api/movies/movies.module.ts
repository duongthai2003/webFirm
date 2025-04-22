import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';
import { MoviesController } from './movies.controller';
import { CategoryModule } from '../category/category.module';
import { EpisodeModule } from '../episode/episode.module';

@Module({
  imports: [
    DatabaseModule.mainDbModels([MainDBModel.Movies, MainDBModel.Episode]),
    CategoryModule,
    // EpisodeModule,
    CloudinaryModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
