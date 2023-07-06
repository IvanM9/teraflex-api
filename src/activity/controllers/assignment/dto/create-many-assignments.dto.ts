import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  Max,
} from 'class-validator';

export class CreateManyAssignmentsDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @ArrayUnique()
  @IsPositive({ each: true })
  @ArrayNotEmpty()
  taskIds: number[];

  @ApiProperty()
  @Max(60)
  @IsPositive()
  @IsNotEmpty()
  estimatedTime: number;

  @ApiProperty()
  @IsBoolean()
  status?: boolean;

  createdById?: number;
}