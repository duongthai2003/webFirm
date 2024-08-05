import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { Document, Model } from 'mongoose';
import { PaginationQuery } from './dto/PaginationQuery.dto';
import { UpdateUserDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User Management')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  @ApiOperation({ summary: 'get all user' })
  async index(@Req() req, @Query() query: PaginationQuery) {
    return this.userService.getPaginate(query.start, query.limit);
  }

  @Post('')
  @ApiOperation({
    summary: 'create user',
  })
  create(@Req() req, @Body() body: CreateUserDto) {
    return this.userService.createuser(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by Id',
  })
  get(@Req() req, @Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  update(@Req() req, @Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  delete(@Req() req, @Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch('admin-reset-pass/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'admin update password user by id' })
  updatepass(@Req() req, @Param('id') id: string, @Body() body) {
    if (req.user.type === 2) {
      return this.userService.adminUpadtwpass(id, body);
    } else {
      throw new BadRequestException('You are not an admin');
    }
  }
}
