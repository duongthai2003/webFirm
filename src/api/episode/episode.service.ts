import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { Episodes } from 'src/libs/models/episodes/episode.entity';
import * as fs from 'fs';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectMainDBModel(MainDBModel.Episode)
    protected readonly model: Model<Episodes>,
    protected readonly moviesService: MoviesService,
  ) {}

  async pagination(start: number, limit: number) {
    const items = await this.model.find(
      {},
      {},
      {
        limit: limit,
        skip: start,
      },
    );

    const total = await this.model.countDocuments();
    return {
      items,
      start,
      limit,
      total,
    };
  }

  async create(body: any, file: any) {
    if (file) {
      const session = await this.model.startSession();
      session.startTransaction();
      try {
        const movie = await this.moviesService.getById(body.movieId);

        const create = await this.model.create({
          ...body,
          nameFile: file.filename,
          // movie: { ...movie },
        });
        await this.moviesService.update(body.movieId, {
          LatestEpisode: body.episodesNum,
        });

        return create;
      } catch (err) {
        fs.unlink(`./upload/videos/${file.filename}`, (err) => {
          if (err) {
            return err;
          }
        });
        await session.abortTransaction();
        session.endSession();
        throw new BadRequestException(err);
      }
    } else {
      throw new BadRequestException('File is required');
    }
  }

  async update(id: string, body: any, file: any) {
    if (file) {
      try {
        const movie = await this.moviesService.getById(body.movieId);
        const episole = await this.model.findById(id);

        await this.model.findByIdAndUpdate(id, {
          ...body,
          nameFile: file.filename,
          movie: movie,
        });
        fs.unlink(`./upload/videos/${episole.nameFile}`, (err) => {
          if (err) {
            return err;
          }
        });
      } catch (err) {
        fs.unlink(`./upload/videos/${file.filename}`, (err) => {
          if (err) {
            return err;
          }
        });

        throw new BadRequestException(err);
      }
    } else {
      throw new BadRequestException('File is required');
    }
  }

  async getAnEpisode(id: string) {
    const episode = await this.model.findById(
      id,
      {},
      {
        populate: ['movieId'],
      },
    );
    const allEpisodesMovie = await this.model.find(
      {
        movieId: episode.movieId,
      },
      {},
      {
        sort: {
          episodesNum: 'desc',
        },
      },
    );
    return {
      episode,
      allEpisodesMovie,
    };
  }

  async getAllEpisodeOfMovie(movieId: string) {
    return await this.model.find({
      _id: movieId,
    });
  }
}
