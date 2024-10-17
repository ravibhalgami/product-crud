import { IsOptional, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { IsImageFile } from '../../common/image-file.validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsImageFile({ message: 'The uploaded file must be an image.' })
  image?: Express.Multer.File;

  @IsOptional()
  imageUrl?:string
}