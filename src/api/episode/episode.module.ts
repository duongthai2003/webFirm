import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';
import { EpisodeController } from './episode.controller';
import { MoviesService } from '../movies/movies.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [DatabaseModule.mainDbModels([MainDBModel.Episode]), MoviesModule],
  controllers: [EpisodeController],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
