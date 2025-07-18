import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      callback(null, `image-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
    ];

    if (!allowedMimeTypes.includes(file.mimetype as string)) {
      return callback(
        new BadRequestException(
          `Invalid file type. Only image files are allowed (${allowedExtensions.join(', ')})`,
        ),
        false,
      );
    }

    // Check file extension
    const fileExt = extname(file.originalname as string).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return callback(
        new BadRequestException(
          `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`,
        ),
        false,
      );
    }

    callback(null, true);
  },
};
