import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { User } from 'src/libs/models/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectMainDBModel(MainDBModel.User)
    protected readonly model: Model<User>,
  ) {}
  async createuser(body: any): Promise<any> {
    const passwordHash = await bcrypt.hash(body.password, 10);
    return this.model.create({
      ...body,
      passwordHash,
    });
  }
  async getPaginate(start: number, limit: number) {
    const items = await this.model.find(
      {},
      {},
      {
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

  async getById(id: string) {
    return this.model.findById(id).exec(); //exec() : theem hay bo exec() ko sao
  }

  async updateUser(id: string, updateQuery: UpdateQuery<any>) {
    return this.model.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  async deleteUser(id: string) {
    const item = await this.model.findById(id).exec();

    if (item) {
      this.model.findByIdAndDelete(id).exec();
      return 'delete user success';
    } else {
      throw new NotFoundException('user is not found!');
    }
  }

  async adminUpadtwpass(id: string, body: any) {
    if (body.newPassword === body.confirmPassword) {
      const passwordHash = await bcrypt.hash(body.newPassword, 10);
      return await this.model.findByIdAndUpdate(id, {
        passwordHash,
      });
    }
  }
}
