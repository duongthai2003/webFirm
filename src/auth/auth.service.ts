import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Document, Model } from 'mongoose';
import { InjectMainDBModel, MainDBModel } from 'src/libs/connections/main-db';
import { User } from 'src/libs/models/user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectMainDBModel(MainDBModel.User)
    protected readonly model: Model<User>,
    protected readonly userService: UserService,
    protected readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.model.findOne({ email: email }); // lay ra user
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const valid = await bcrypt.compare(password, user.toObject().passwordHash); // so sanh giua pass truyen vao vaof pas trong database
    if (!valid) {
      throw new UnauthorizedException();
    }
    return user;
  }
  async login(user: Document<any, any, User>) {
    const newUser = user.toJSON();
    delete newUser['passwordHash'];
    // await user.updateOne({});
    return {
      user: newUser,
      accessToken: this.jwt.sign({
        sub: user._id,
        email: user.toObject().email,
      }),
    };
  }

  async getCurrentUser(userId?: any) {
    const user = this.model.findOne({
      _id: userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async register(body: any) {
    const findUser = await this.model.findOne({
      email: body.email.toLowerCase().trim(),
    });
    if (findUser) {
      throw new BadRequestException("User's email already existed!");
    }
    return this.userService.createuser({
      ...body,
      email: body.email.toLowerCase().trim(),
    });
  }
}
