import { BadRequestException, Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { Category } from 'src/libs/models/category/category.entity';
import { Movies } from 'src/libs/models/movies/movies.entity';
import { CategoryService } from '../category/category.service';
import * as fs from 'fs';
import { User } from 'src/libs/models/user/user.entity';
import _, { set } from 'lodash';

@Injectable()
export class MoviesService<T = Document> {
  constructor(
    @InjectMainDBModel(MainDBModel.Movies)
    protected readonly model: Model<Movies>,
    protected readonly categoryService: CategoryService,
  ) {}

  async panigation(start: number, limit: number, query?: FilterQuery<T>) {
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

  async update(id: string, body: any, file: any) {
    const movie = await this.model.findById(id);
    const categorys = await this.categoryService.findByIds(body.categorys);
    if (file) {
      try {
        await this.model.findByIdAndUpdate(
          id,
          {
            ...body,
            poster: file.filename,
            categorys: categorys,
          },
          {
            new: true,
          },
        );
        fs.unlink(`./upload/posters/${movie.poster}`, (err) => {
          if (err) {
            return err;
          }
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
}

// '',
// '',
// '',
