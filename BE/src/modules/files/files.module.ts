// src/modules/files/files.module.ts
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
