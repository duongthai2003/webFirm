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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class MoviesService {
  constructor(
    @InjectMainDBModel(MainDBModel.Movies)
    protected readonly model: Model<Movies>,
    @InjectMainDBModel(MainDBModel.Episode)
    protected readonly modelEpisode: Model<Episodes>,
    protected readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async panigation(start: number, limit: number, query?: FilterQuery<Movies>) {
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

  async create(body: any, file: Express.Multer.File) {
    const items = await this.categoryService.findByIds(body.categorys);

    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file);

      return await this.model.create({
        ...body,
        categorys: items,
        poster: uploadResult.secure_url,
        populalStatus: PopularStatus.notpopular,
      });
    } catch (err) {
      return err.message;
    }
  }

  // thêm, sóa file vao upload

  // async update(id: string, body: any, file?: any) {
  //   const movie = await this.model.findById(id);
  //   const categorys = await this.categoryService.findByIds(body.categorys);

  //   try {
  //     const update = await this.model.findByIdAndUpdate(
  //       id,
  //       {
  //         ...body,
  //         poster: file && file.filename,
  //         categorys: categorys,
  //       },
  //       {
  //         new: true,
  //       },
  //     );
  //     file &&
  //       fs.unlink(`./upload/posters/${movie.poster}`, (err) => {
  //         if (err) {
  //           return err;
  //         }
  //       });
  //     return update;
  //   } catch (err) {
  //     file &&
  //       fs.unlink(`./upload/posters/${file && file.filename}`, (err) => {
  //         if (err) {
  //           return err;
  //         }
  //       });

  //     return err.message;
  //   }
  // }

  async update(id: string, body: any, file?: Express.Multer.File) {
    const movie = await this.model.findById(id);
    const categorys = await this.categoryService.findByIds(body.categorys);

    try {
      let posterUrl = movie.poster;

      // Nếu có file mới -> upload lên Cloudinary
      if (file) {
        // Xóa ảnh cũ nếu đang dùng Cloudinary (option: chỉ khi dùng cloudinary url)

        if (posterUrl?.includes('res.cloudinary.com')) {
          // Tách public_id từ URL cũ để xóa
          const publicId = this.extractPublicIdFromUrl(posterUrl);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        }

        const uploadResult = await this.cloudinaryService.uploadImage(file);
        posterUrl = uploadResult.secure_url;
      }

      const update = await this.model.findByIdAndUpdate(
        id,
        {
          ...body,
          poster: posterUrl,
          categorys: categorys,
        },
        { new: true },
      );

      return update;
    } catch (err) {
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

  async getMovieofCategory(categoryId: string) {
    const category = await this.categoryService.findById(categoryId);

    const items = await this.model.find({
      categorys: {
        $elemMatch: {
          _id: categoryId,
        },
      },
    });
    return {
      items,
      category,
    };
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const fileWithExt = urlParts[urlParts.length - 1];
      const publicId = fileWithExt.split('.')[0];

      // Lấy các phần "webfirm/posters" nằm ở cuối URL
      const folder1 = urlParts[urlParts.length - 3]; // webfirm
      const folder2 = urlParts[urlParts.length - 2]; // posters

      return `${folder1}/${folder2}/${publicId}`;
    } catch (error) {
      console.error('Error extracting publicId:', error);
      return null;
    }
  }
}
