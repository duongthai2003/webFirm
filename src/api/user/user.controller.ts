import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { Document, Model } from 'mongoose';
import { PaginationQuery } from './dto/PaginationQuery.dto';
import { UpdateUserDto } from './dto/update.dto';

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
}
