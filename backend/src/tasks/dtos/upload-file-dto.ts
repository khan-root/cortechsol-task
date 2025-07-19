import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  attachment_url: Express.Multer.File;
}
