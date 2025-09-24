import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Public } from 'src/health/decorator/customize';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const created = new this.categoryModel(dto);
    return created.save();
  }

  async findAll() {
    return this.categoryModel.find().exec(); 
  }

  @Public()
  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category || category.isDeleted)
      throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.softDelete({ _id: id });
    if (!category) throw new NotFoundException('Category not found');
    return { message: 'Category deleted successfully' };
  }
}
