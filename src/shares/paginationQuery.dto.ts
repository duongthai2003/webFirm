import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    default: 0,
  })
  start?: number;
  @ApiProperty({
    default: 10,
  })
  limit?: number;
}
