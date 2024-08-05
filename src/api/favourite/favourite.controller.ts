import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shares/paginationQuery.dto';
import { CreateFavouriteDto } from './dto/create.dto';
import { FavouriteService } from './favourite.service';

@ApiTags('Favourite Management')
@Controller('favourite')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class FavouriteController {
  constructor(protected readonly favouriteService: FavouriteService) {}

  @Get('')
  @ApiOperation({
    summary: 'get favourite list',
  })
  index(@Req() req) {
    return this.favouriteService.pagination(req.user._id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @ApiOperation({ summary: 'create favourite movie' })
  create(@Req() req, @Body() body: CreateFavouriteDto) {
    return this.favouriteService.createFavourite(req.user._id, body.movieId);
  }
}
