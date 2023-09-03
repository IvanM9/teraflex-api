import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty()
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
      require_valid_protocol: true,
      host_whitelist: ['www.youtube.com'],
    },
    {
      message: 'El campo url debe ser una url válida, de la plataforma Youtube',
      always: true,
    },
  )
  url: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBooleanString({
    message: 'El campo isPublic debe ser booleano, como string',
  })
  @IsOptional()
  isPublic: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  createdById: number;
}

export class uploadMultimediaDto extends OmitType(CreateLinkDto, ['url']) {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    maxItems: 5,
  })
  files: Array<Express.Multer.File>;
}
