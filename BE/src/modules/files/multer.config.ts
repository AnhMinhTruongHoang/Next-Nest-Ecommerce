import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => process.cwd();

  ensureExists(targetDirectory: string) {
    try {
      fs.mkdirSync(targetDirectory, { recursive: true });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = (req?.headers?.folder_type as string) ?? 'default';
          const target = join(this.getRootPath(), `public/images/${folder}`);
          this.ensureExists(target);
          cb(null, target);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const baseName = basename(file.originalname, ext);
          const finalName = `${baseName}-${Date.now()}${ext}`;
          cb(null, finalName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new HttpException(
              'Invalid file type',
              HttpStatus.UNPROCESSABLE_ENTITY,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    };
  }
}
