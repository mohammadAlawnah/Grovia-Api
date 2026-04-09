import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ProductModule } from '../products/products.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [forwardRef(()=> UsersModule) , TypeOrmModule.forFeature([Review]),ProductModule , UsersModule , JwtModule]
})
export class ReviewModule {}

