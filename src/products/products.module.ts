import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { JwtModule } from '@nestjs/jwt';
import { Category } from '../category/category.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Product, Category]),
    JwtModule,
    CategoryModule,
  ],
  exports: [ProductService],
})
export class ProductModule {}