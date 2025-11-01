import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateReviewDto) {
    const user = req.user; // do JwtAuthGuard inject
    return this.reviewsService.create(user._id, dto, {
      _id: user._id,
      email: user.email,
    });
  }

  @Get()
  findAll(@Query() q: QueryReviewDto) {
    return this.reviewsService.findAll(q);
  }

  @Get('summary/:productId')
  summary(@Param('productId') productId: string) {
    return this.reviewsService.summary(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateReviewDto,
  ) {
    const user = req.user;
    return this.reviewsService.update(id, dto, {
      _id: user._id,
      email: user.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.reviewsService.remove(id, {
      _id: user._id,
      email: user.email,
    });
  }
}
