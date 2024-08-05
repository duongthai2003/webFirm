import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as _ from 'lodash';

@ApiTags('Auht')
@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @UseGuards(AuthGuard('local')) //muon cai nay cahuy thif phai co file local.strategy.ts
  login(@Req() req, @Body() body: LoginDto) {
    // muon cai req co data thif phair lam o ben local.strategy.ts
    return this.authServices.login(req.user);
  }

  @Get('me')
  @ApiOperation({ summary: 'get current user login' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  index(@Req() req) {
    return _.pick(req.user, [
      'createdAt',
      'email',
      'firstName',
      'lastName',
      'updatedAt',
      'username',
      '__v',
      '_id',
    ]);
  }

  @Post('register')
  @ApiOperation({
    summary: 'register',
  })
  register(@Req() req, @Body() body: RegisterDto) {
    return this.authServices.register(body).then((user) => user.toJSON());
  }
}
