import { ApiProperty } from '@nestjs/swagger';

export class UpdaetCategoryDto {
  @ApiProperty({})
  categoryName: string;
}
