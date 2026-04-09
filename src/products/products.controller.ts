import { AuthRolesGuard } from './../users/guards/auth-roles.guard';
import { Config } from './../../node_modules/@sqltools/formatter/lib/core/types.d';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  Query
} from '@nestjs/common';

import { CreateProductDto } from './dtos/create-product-dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './products.service';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { userType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type  { JWTPayloadType } from 'src/utils/types';

@Controller('/api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductService,
    private readonly Config: ConfigService,
  ) {}

  @Post()
  @Roles(userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public createNewProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() payload: JWTPayloadType
  ) {
    return this.productsService.createNewProduct(body,payload.id);
  }

  // Get: ~/api/prosucts
  @Get()
  public getAllProduccts(
    @Query("title") title:string,
    @Query("minPrice") minPrice:string,
    @Query("maxPrice") maxPrice:string

  ) {

    return this.productsService.getAllProduccts(title,minPrice,maxPrice);
  }

  @Get(':id')
  public getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProduct(id);
  }

  // PUT : ~/api/products/:id
  @Put(':id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) body: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, body);
  }

  // Delete : ~/api/products/:id
  @Delete(':id')
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
