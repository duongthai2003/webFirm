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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.dto';
import { PaginationQuery } from './dto/paginationQuery.dto';
import { UpdaetCategoryDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Category Management')
@Controller('category')
export class CategoryController {
  constructor(protected readonly categoryService: CategoryService) {}

  @Get('')
  @ApiOperation({
    summary: 'get all Category',
  })
  index(@Req() req, @Query() query: PaginationQuery) {
    return this.categoryService.getPaginate(query.start, query.limit);
  }
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('')
  @ApiOperation({
    summary: 'create Category',
  })
  create(@Req() req, @Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'update Category',
  })
  updaet(@Req() req, @Param('id') id: string, @Body() body: UpdaetCategoryDto) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete Category',
  })
  delete(@Param('id') id: string) {
    return this.categoryService.deleteCatergory(id);
  }
}
