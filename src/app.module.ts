import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './libs/connections/database.module';
import { userModule } from './api/user/user.module';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './api/category/category.module';
import { MoviesModule } from './api/movies/movies.module';
import { EpisodeModule } from './api/episode/episode.module';
import { FavouriteModule } from './api/favourite/favourite.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // de doc dc file .env
    // MongooseModule.forRoot('mongodb://localhost/Web_Firm'),

    DatabaseModule.mainDb(),
    FavouriteModule,
    AuthModule,
    userModule,
    CategoryModule,
    MoviesModule,
    EpisodeModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
