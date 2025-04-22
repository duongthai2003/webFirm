import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';
import { EpisodeController } from './episode.controller';
import { MoviesModule } from '../movies/movies.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.mainDbModels([MainDBModel.Episode]),
    MoviesModule,
    CloudinaryModule,
  ],
  controllers: [EpisodeController],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
