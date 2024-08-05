import { BadRequestException, Controller, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { Favourite } from 'src/libs/models/favourite/favourite.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectMainDBModel(MainDBModel.Favourite)
    protected readonly model: Model<Favourite>,
  ) {}

  async pagination(userId: string) {
    const items = await this.model.find(
      {
        userId: userId,
      },
      {},
      {
        sort: {
          createAt: 'desc',
        },
        // limit: limit,
        // skip: start,
        populate: ['userId', 'movieId'],
      },
    );

    const total = await this.model.countDocuments();
    return {
      items,

      total,
    };
  }

  async createFavourite(userId: string, movieId: string) {
    console.log('movieId', movieId);

    const item = await this.model.find({
      movieId: movieId,
      userId: userId,
    });
    if (item.length > 0) {
      throw new BadRequestException('already on the list');
    }
    // console.log(item);
    return await this.model.create({ movieId, userId: userId });
  }
}
