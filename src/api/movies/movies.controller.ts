import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMoviesDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMoviesDto } from './dto/update.dto';
import { Response } from 'express';
import { PaginationQueryDto } from 'src/shares/paginationQuery.dto';
import { AuthGuard } from '@nestjs/passport';
import CustomFileImg from '../../shares/customFile/customFileImg';
import * as _ from 'lodash';

@ApiTags('Movies')
@Controller('movies')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
export class MoviesController {
  constructor(protected readonly moviesService: MoviesService) {}

  @Get('')
  @ApiOperation({
    summary: 'get movies',
  })
  index(@Req() req, @Query() query: PaginationQueryDto) {
    return this.moviesService.panigation(query.start, query.limit);
  }
  @Post('')
  @ApiOperation({ summary: 'create movies' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       namefirm: { type: 'string' },
  //       description: { type: 'string' },
  //       categorys: { type: '[string]' },
  //       file: { type: 'string', format: 'binary' },
  //     },
  //   },
  // })
  @UseInterceptors(FileInterceptor('file', CustomFileImg()))
  create(
    @Req() req,
    @Body() body: CreateMoviesDto,
    @UploadedFile() // new ParseFilePipe({
    //   validators: [
    file //     new MaxFileSizeValidator({
    //       maxSize: 1000,
    //       message: 'file nho hơn 1000 kb',
    //     }), // quy định dung luong file
    //     new FileTypeValidator({
    //       fileType: 'image/jpeg',
    //     }),
    //   ],
    // }),
    : Express.Multer.File,
  ) {
    // console.log(body, typeof body.categorys, file);

    return this.moviesService.create(body, file);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'update movies',
  })
  @UseInterceptors(FileInterceptor('file', CustomFileImg()))
  update(
    @Param('id') id: string,
    @Body() body: UpdateMoviesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('gggg', file);

    return this.moviesService.update(id, body, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete movie',
  })
  delete(@Req() req, @Param('id') id: string) {
    // console.log(
    //   'rrrrrrrrrr',
    //   _.pick(req.user, [
    //     '_id',
    //     'email',
    //     'username',
    //     'firstName',
    //     'lastName',
    //   ]) as any,
    // );
    return this.moviesService.sofDelete(id, req.user);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular movie' })
  popular() {
    return this.moviesService.getPopuleMovie();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get an movie by Id' })
  async getAnMovie(@Param('id') id: string) {
    return this.moviesService.getAnMovieById(id);
  }

  ///'get static image file
  @Get('poster/:filename')
  @ApiOperation({ summary: 'get static image file' })
  async getfile(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './upload/posters' });
  }

  @Get('movieOfCategory/:id')
  @ApiOperation({ summary: 'get movie of category' })
  getofcategory(@Param('id') id: string) {
    return this.moviesService.getMovieofCategory(id);
  }
}
