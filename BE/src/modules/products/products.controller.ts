import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public, ResponseMessage } from 'src/health/decorator/customize';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../files/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
  /// thumb
  @Post('upload')
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return {
      message: 'Thumbnail uploaded!',
      file: '/images/thumbnails/' + file.filename,
      body,
    };
  }

  /// images
  @Post('upload-slider')
  @UseInterceptors(FilesInterceptor('slider', 5, multerConfig))
  async uploadSlider(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
  ) {
    return {
      message: 'Slider images uploaded!',
      files: files.map((f) => '/images/slider/' + f.filename),
      body,
    };
  }

  ///

  @Public()
  @Get()
  @ResponseMessage('Fetch product with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: any,
  ) {
    return this.productsService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
