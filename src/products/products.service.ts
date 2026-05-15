import { UserService } from './../users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product-dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Between, Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
    private readonly categoryService : CategoryService,
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

  public getAllProduccts(title?: string, minPrice?: string, maxPrice?: string,category?:string) {


    const fillter = {
      ...(title ? {title:Like(`%${title.toLocaleLowerCase()}%`)} : {}),
      ...(minPrice && maxPrice? {price: Between(Number(minPrice), Number(maxPrice))} : {}),
      
    }

    return this.productRepository.find({
      where: fillter,
    });
  }

  public async getProductByCategory(category : string){

    const mycategory = await this.categoryService.getCategory(category)

    if(!mycategory){
      throw new NotFoundException("Category Not Found");
    }

    const products = await this.productRepository.find({where : {category:mycategory.category}})

    return {message : "success", products:products}
    

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

  public async findProductByTitle(title: string) {
    const product = await this.productRepository.findOne({
      where: {
        title: Like(`%${title.toLowerCase()}%`),
      },
    });

    return product;
  }

  public async getProductsForAi() {
    const products = await this.productRepository.find({
      select: {
        id: true,
        title: true,
        price: true,
      },
    });

    return products;
  }
  public async findMatchingProducts(title: string) {
    const normalized = title.toLowerCase().trim();
    const singular = normalized.endsWith('s')
      ? normalized.slice(0, -1)
      : normalized;

    const products = await this.productRepository.find();

    const exactMatch = products.find(
      (product) => product.title.toLowerCase() === normalized,
    );

    if (exactMatch) {
      return { type: 'exact', products: [exactMatch] };
    }

    const singularMatch = products.find(
      (product) => product.title.toLowerCase() === singular,
    );

    if (singularMatch) {
      return { type: 'exact', products: [singularMatch] };
    }

    const containsMatches = products.filter((product) =>
      product.title.toLowerCase().includes(singular),
    );

    if (containsMatches.length === 1) {
      return { type: 'exact', products: containsMatches };
    }

    if (containsMatches.length > 1) {
      return { type: 'multiple', products: containsMatches };
    }

    return { type: 'none', products: [] };
  }

 public async searchProductsForAi(filters: {
  category?: string;
  tags?: string[];
  maxPrice?: number;
  minPrice?: number;
  isLowCalorie?: boolean;
  isVegan?: boolean;
  isSugarFree?: boolean;
}) {
  const products = await this.productRepository.find({
    relations: ['category'],
  });

  let results = products.filter((product) => product.isActive);

  if (filters.category) {
    const categoryLower = filters.category.toLowerCase();

    results = results.filter(
      (product) =>
        product.category?.name?.toLowerCase().includes(categoryLower) ||
        product.title.toLowerCase().includes(categoryLower) ||
        product.description.toLowerCase().includes(categoryLower),
    );
  }

  if (typeof filters.minPrice === 'number') {
    results = results.filter(
      (product) => Number(product.price) >= filters.minPrice!,
    );
  }

  if (typeof filters.maxPrice === 'number') {
    results = results.filter(
      (product) => Number(product.price) <= filters.maxPrice!,
    );
  }

  if (filters.isLowCalorie === true) {
    results = results.filter((product) => product.isLowCalorie === true);
  }

  if (filters.isVegan === true) {
    results = results.filter((product) => product.isVegan === true);
  }

  if (filters.isSugarFree === true) {
    results = results.filter((product) => product.isSugarFree === true);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((product) => {
      if (!product.tags || product.tags.length === 0) return false;

      const productTags = product.tags.map((tag) => tag.toLowerCase());

      return filters.tags!.some((tag) =>
        productTags.includes(tag.toLowerCase()),
      );
    });
  }

  return results;
}
}
