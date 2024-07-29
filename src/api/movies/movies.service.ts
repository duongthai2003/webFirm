import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { Category } from 'src/libs/models/category/category.entity';
import { Movies, PopularStatus } from 'src/libs/models/movies/movies.entity';
import { CategoryService } from '../category/category.service';
import * as fs from 'fs';
import { User } from 'src/libs/models/user/user.entity';
import * as _ from 'lodash';
import { Episodes } from 'src/libs/models/episodes/episode.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectMainDBModel(MainDBModel.Movies)
    protected readonly model: Model<Movies>,
    @InjectMainDBModel(MainDBModel.Episode)
    protected readonly modelEpisode: Model<Episodes>,
    protected readonly categoryService: CategoryService,
  ) {}

  async panigation(start: number, limit: number, query?: FilterQuery<Movies>) {
    console.log({ ...query });

    const items = await this.model.find(
      { ...query, deleteAt: null }, //điều kiện
      {},
      {
        sort: {
          createdAt: 'desc',
        },
        limit: limit || 0,
        skip: start || 0,
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
    const items = await this.categoryService.findByIds(body.categorys);

    if (file) {
      try {
        return await this.model.create({
          ...body,
          categorys: items,
          poster: file.filename,
          populalStatus: PopularStatus.notpopular,
        });
      } catch (err) {
        fs.unlink(`./upload/posters/${file.filename}`, (err) => {
          if (err) {
            return err;
          }
        });

        return err.message;
      }
    } else {
      throw new BadRequestException('file is required');
    }
  }

  async update(id: string, body: any, file?: any) {
    const movie = await this.model.findById(id);
    const categorys = await this.categoryService.findByIds(body.categorys);

    try {
      const update = await this.model.findByIdAndUpdate(
        id,
        {
          ...body,
          poster: file && file.filename,
          categorys: categorys,
        },
        {
          new: true,
        },
      );
      file &&
        fs.unlink(`./upload/posters/${movie.poster}`, (err) => {
          if (err) {
            return err;
          }
        });
      return update;
    } catch (err) {
      file &&
        fs.unlink(`./upload/posters/${file && file.filename}`, (err) => {
          if (err) {
            return err;
          }
        });

      return err.message;
    }
  }

  async sofDelete(id: string, currentUser: User) {
    return await this.model.findByIdAndUpdate(id, {
      deleteAt: new Date(),
      deleteBy: {
        _id: currentUser._id,
        email: currentUser.email,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        fullName: currentUser.fullName,
      },
    });
  }

  async getPopuleMovie() {
    return await this.model.find({
      populalStatus: 1,
    });
  }

  async getAnMovieById(id: string) {
    const movie = await this.model.findById(id);
    const episodes = await this.modelEpisode.find(
      {
        movieId: id,
      },
      {},
      {
        sort: {
          episodesNum: 'desc',
        },
        populate: ['movieId'], // lay ra thong tin cua movie duaj vao id
      },
    );
    return { movie, episodes };
  }

  async getById(id: string) {
    return await this.model.findById(id);
  }
}
