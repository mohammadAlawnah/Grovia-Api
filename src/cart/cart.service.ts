import { ProductService } from './../products/products.service';
import { UserService } from './../users/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  public async addToCart(userId: number, productId: number) {
    const user = await this.userService.getCurrentUser(userId);

    if (!user) throw new NotFoundException('User Not Found');

    const product = await this.productService.getProduct(productId);

    if (!product) throw new NotFoundException('Product Not Found');

    let cart = await this.cartRepository.findOne({
      where: {
        user: { id: user.id },
      },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user,
        items: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    const existingCartItem = cart.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      existingCartItem.price =
        Number(existingCartItem.quantity) * Number(product.price);

      await this.cartItemRepository.save(existingCartItem);
      return {
        message: 'Product quantity updated in cart',
        cartItem: existingCartItem,
      };
    }

    const cartItem = this.cartItemRepository.create({
      cart,
      product,
      quantity: 1,
      price: Number(product.price),
    });

    await this.cartItemRepository.save(cartItem);

    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    });

    if (!updatedCart) {
      throw new NotFoundException('Cart Not Found');
    }

    const totalPrice = updatedCart.items.reduce((total, item) => {
      return total + Number(item.price);
    }, 0);

    return {
      message: 'Product added to cart',
      totalPrice,
    };


  }
  public async getUserCart(userId: number) {
  const user = await this.userService.getCurrentUser(userId);

  if (!user) throw new NotFoundException('User Not Found');

  const cart = await this.cartRepository.findOne({
    where: {
      user: { id: user.id },
    },
    relations: ['items', 'items.product'],
  });

  if (!cart) {
    return {
      message: 'Cart is empty',
      items: [],
      totalPrice: 0,
    };
  }

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  return {
    message: 'success',
    items: cart.items,
    totalPrice,
  };
}
}
