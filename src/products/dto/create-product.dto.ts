import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsImageFile } from '../../common/image-file.validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string;
 
  @IsImageFile({ message: 'The uploaded file must be an image' })
  image: Express.Multer.File;
}