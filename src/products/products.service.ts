import { UserService } from './../users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product-dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Between, Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  /**
   * Create New Product
   * @param dto data for creating new product
   * @param userId id of the logged in user (Admin)
   * @returns the create product from the database
   */
  public async createNewProduct(dto: CreateProductDto, userId: number) {
    const user = await this.userService.getCurrentUser(userId);

    const newProduct = this.productRepository.create({
      ...dto,
      title: dto.title.toLocaleLowerCase(),
      user,
    });
    return await this.productRepository.save(newProduct);
  }

  public getAllProduccts(title?: string, minPrice?: string, maxPrice?: string) {

    const fillter = {
      ...(title ? {title:Like(`%${title.toLocaleLowerCase()}%`)} : {}),
      ...(minPrice && maxPrice? {price: Between(Number(minPrice), Number(maxPrice))} : {})
    }

    return this.productRepository.find({
      where: fillter,
    });
  }

  
  public async getProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true, reviews: true },
    });
    if (!product) {
      throw new NotFoundException('Noooooooo Product found', {
        description: 'this is description',
      });
    }
    return product;
  }

  public async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.getProduct(id);

    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;

    return this.productRepository.save(product);
  }

  public async deleteProduct(id: number) {
    const product = await this.getProduct(id);
    await this.productRepository.remove(product);

    return { message: 'product deleted successfully' };
  }
}
