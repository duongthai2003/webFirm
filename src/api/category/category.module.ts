import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import {
  DatabaseModule,
  MainDBModel,
} from 'src/libs/connections/database.module';

@Module({
  imports: [DatabaseModule.mainDbModels([MainDBModel.Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
