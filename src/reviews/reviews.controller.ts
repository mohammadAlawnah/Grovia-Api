import { AuthGuard } from './../users/guards/auth.guard';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { UserService } from '../users/user.service';
import { Roles } from '../users/decorators/user-role.decorator';
import { userType } from '../utils/enums';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { JWTPayloadType } from '../utils/types';
import { UpdateRevieoDto } from './dtos/update-review.dto';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller("/api/reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService : ReviewService,
    private readonly usersServics : UserService
  ){};

  // POST ~/api/reviews/:productId
  @Post(":productId")
  @Roles(userType.ADMIN,userType.NORMAL_USER)
  @UseGuards(AuthGuard)
  public createNewReview(
    @Param('productId',ParseIntPipe) productId: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
  ){
    return this.reviewsService.createReview(productId,payload.id,body)
  }


  @Get(":ProductId")
  public getAllReview(@Param('ProductId',ParseIntPipe) ProductId:number) {

    return this.reviewsService.getAllReviews(ProductId);
  
  }

  @Put(":reviewId")
  @UseGuards(AuthGuard)
  @Roles(userType.ADMIN,userType.NORMAL_USER)
  public updateReview(
    @Param('reviewId', ParseIntPipe) reviewId:number,
    @CurrentUser() payload: JWTPayloadType,
    @Body() body:UpdateRevieoDto
  ){
    return this.reviewsService.updateReview(reviewId , payload.id,body);

  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(userType.ADMIN)
  public getAll(
    @Query("pageNumber", ParseIntPipe) pageNumber:number,
    @Query("reviewPerPage",ParseIntPipe) reviewPerPage:number
  ){
    return this.reviewsService.getAll(pageNumber,reviewPerPage)

  }
 

//  @Post('upload')
// @UseInterceptors(FileInterceptor('file'))
// uploadFile(@UploadedFile() file: Express.Multer) {
//   console.log(file);
// }
}
