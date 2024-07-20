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
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMoviesDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateMoviesDto } from './dto/update.dto';
import { Response } from 'express';
import * as path from 'path';
import { PaginationQueryDto } from 'src/shares/paginationQuery.dto';
import { AuthGuard } from '@nestjs/passport';
import CustomFileImg from '../../shares/customFile/customFileImg';
import _ from 'lodash';

@ApiTags('Movies')
@Controller('movies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
    return this.moviesService.update(id, body, file);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete movie',
  })
  delete(@Req() req, @Param('id') id: string) {
    // console.log(
    //   'ttttttttttttt',
    //   _.pick(req.user, [
    //     'id',
    //     'email',
    //     'username',
    //     'firstName',
    //     'lastName',
    //   ]) as any,
    // );
    return this.moviesService.sofDelete(id, req.user);
  }

  // @Get('/getfile')
  // getfile(@Res() res: Response, @Body() body: NamefileDto) {
  //   res.sendFile(path.join(__dirname, '../upload/images/test.jpg'));
  // }
}
