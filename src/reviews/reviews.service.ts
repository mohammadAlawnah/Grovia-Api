import { Product } from './../products/product.entity';
import { ProductService } from './../products/products.service';
import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateRevieoDto } from './dtos/update-review.dto';
import { userType } from '../utils/enums';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly ProductService: ProductService,
    private readonly UserService: UserService,
  ) {}

  public async createReview(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ) {
    const product = await this.ProductService.getProduct(productId);
    const user = await this.UserService.getCurrentUser(userId);

    const { rating } = dto;
    const { comment } = dto;
    console.log(rating, comment);
    const review = this.reviewsRepository.create({
      rating,
      comment,
      user,
      product,
    });
    return this.reviewsRepository.save(review);
  }

  public async getAll(pageNumber: number, reviewPerPage: number) {
    return this.reviewsRepository.find({
      skip: reviewPerPage*(pageNumber-1),
      take: 3,
      order: { createdAt: 'DESC' },
    });
  }

  public async getAllReviews(productId: number) {
    const product = await this.ProductService.getProduct(productId);

    if (!product) throw new NotFoundException('Product Not Found');

    const reviews = await this.reviewsRepository.find({
      where: { product: { id: product.id } },
    });
    return reviews;
  }

  public async updateReview(
    reviewId: number,
    userId: number,
    dto: UpdateRevieoDto,
  ) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Not Found Review');
    }

    if (review.user.id != userId) {
      throw new ForbiddenException('access denid, you are not allowed');
    }

    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;

    return await this.reviewsRepository.save(review);
  }

  public async getSingleReviews(reviewId: number) {
    return this.getReview(reviewId);
  }

  public async deleteReviews(reviewId: number, userId: number) {
    const review = await this.getReview(reviewId);

    const user = await this.UserService.getCurrentUser(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (review.user.id === user.id || user.usertype === userType.ADMIN) {
      return await this.reviewsRepository.delete(reviewId);
    }

    throw new ForbiddenException('Not Allawo');
  }

  private async getReview(reviewId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Not Found Review');
    }

    return review;
  }
}
