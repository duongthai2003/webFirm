import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { Episodes } from 'src/libs/models/episodes/episode.entity';
import * as fs from 'fs';
import { MoviesService } from '../movies/movies.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectMainDBModel(MainDBModel.Episode)
    protected readonly model: Model<Episodes>,
    protected readonly moviesService: MoviesService,
    private readonly cloudinaryService: CloudinaryService,
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

  async create(body: any, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const movie = await this.moviesService.getById(body.movieId);

      // 🔼 Upload video lên Cloudinary (dạng video)
      const uploadResult = await this.cloudinaryService.uploadVideo(file);

      const created = await this.model.create({
        ...body,
        nameFile: uploadResult.secure_url, // hoặc dùng public_id nếu bạn cần
      });

      await this.moviesService.update(body.movieId, {
        LatestEpisode: body.episodesNum,
      });

      await session.commitTransaction();
      session.endSession();

      return created;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestException(err);
    }
  }

  async update(id: string, body: any, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const movie = await this.moviesService.getById(body.movieId);
      const episode = await this.model.findById(id);

      // ✅ Xóa video cũ khỏi Cloudinary (nếu đang dùng Cloudinary URL)
      if (episode?.nameFile?.includes('res.cloudinary.com')) {
        const publicId = this.extractPublicIdFromUrl(episode.nameFile);
        if (publicId) {
          await this.cloudinaryService.deleteVideo(publicId);
        }
      }

      // ✅ Upload video mới
      const uploadResult = await this.cloudinaryService.uploadVideo(file);

      // ✅ Cập nhật vào DB
      const update = await this.model.findByIdAndUpdate(id, {
        ...body,
        nameFile: uploadResult.secure_url,
        // movie: movie,
      });

      return update;
    } catch (err) {
      throw new BadRequestException(err);
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

  async getAllEpisodeOfMovie(movieId: string, start: number, limit: number) {
    const items = await this.model.find(
      {
        movieId: movieId,
      },
      {},
      {
        sort: {
          episodesNum: 'desc',
        },
        limit: limit,
        skip: start,
      },
    );
    return {
      items,
      start,
      limit,
    };
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const match = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}
