import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { Category } from 'src/libs/models/category/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectMainDBModel(MainDBModel.Category)
    protected readonly model: Model<Category>,
  ) {}

  async getPaginate(start: number, limit: number) {
    const items = await this.model.find(
      {},
      {},
      {
        // sort: {
        //   createdAt: 'desc',
        // },
        limit: limit || 10,
        skip: start || 0,
      },
    );
    const totals = await this.model.countDocuments();
    return {
      items,
      start: Number(start),
      limit: Number(limit),
      totals,
    };
  }

  async create(body: any) {
    return await this.model.create({
      ...body,
    });
  }

  async update(id: string, body: any) {
    return await this.model.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true },
    );
  }

  async deleteCatergory(id: string) {
    const item = await this.model.findById(id).exec();
    if (item) {
      await this.model.findByIdAndDelete(id);
      return 'delete category success';
    } else {
      throw new NotFoundException('category is not found!');
    }
  }
  async findByIds(ids: string[]) {
    const items = await this.model.find({
      _id: {
        $in: ids,
      },
    });

    return items.map((item) => item.toObject());
  }

  async findById(id: string) {
    return this.model.findById(id);
  }
}
