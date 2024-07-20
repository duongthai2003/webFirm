import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEpisodeDto } from './dto/create.dto';
import { EpisodeService } from './episode.service';
import CustomFileVideo from 'src/shares/customFile/customFileVideo';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/shares/paginationQuery.dto';

@ApiTags('tap phim')
@Controller('episode')
export class EpisodeController {
  constructor(protected readonly episodeService: EpisodeService) {}

  @Get('')
  @ApiOperation({ summary: 'get episode list' })
  panigation(@Query() query: PaginationQueryDto) {
    return this.episodeService.pagination(query.start, query.limit);
  }

  @Post('')
  @ApiOperation({ summary: 'create episode' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nameEpisodes: { type: 'string' },
        episodesNum: { type: 'number' },
        movieId: { type: 'string' },

        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', CustomFileVideo()))
  indexedDB(@Body() body, @UploadedFile() file: Express.Multer.File) {
    return this.episodeService.create(body, file);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update Episode' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nameEpisodes: { type: 'string' },
        episodesNum: { type: 'number' },
        movieId: { type: 'string' },

        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', CustomFileVideo()))
  update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.episodeService.update(id, body, file);
  }
}
