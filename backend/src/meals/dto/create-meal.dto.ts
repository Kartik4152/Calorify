import { ApiProperty } from '@nestjs/swagger';

export class CreateMealDto {
  @ApiProperty({ type: 'string', example: 'Vanilla Icecream' })
  name: string;

  @ApiProperty({ type: 'number', example: 225 })
  calories: number;

  @ApiProperty({ type: 'number', example: 11 })
  date: number;

  @ApiProperty({ type: 'number', example: 11 })
  month: number;

  @ApiProperty({ type: 'number', example: 2021 })
  year: number;

  @ApiProperty({ type: 'number', example: 17 })
  hour: number;

  @ApiProperty({ type: 'number', example: 55 })
  minute: number;
}
