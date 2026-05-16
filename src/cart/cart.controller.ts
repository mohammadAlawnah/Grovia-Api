import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../users/decorators/user-role.decorator';
import { CartService } from './cart.service';
import { userType } from '../utils/enums';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { JWTPayloadType } from '../utils/types';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(userType.NORMAL_USER, userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Post('/:id')
  public async addProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    return await this.cartService.addToCart(payload.id, productId);
  }

  @Roles(userType.NORMAL_USER, userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Get()
  public async getUserCart(@CurrentUser() payload: JWTPayloadType) {
    return await this.cartService.getUserCart(payload.id);
  }

  @Roles(userType.NORMAL_USER, userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Delete('/:id')
  public async removeProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    return await this.cartService.removeFromCart(payload.id, productId);
  }

  @Roles(userType.NORMAL_USER, userType.ADMIN)
@UseGuards(AuthRolesGuard)
@Post('/increase/:id')
public async increaseQuantity(
  @CurrentUser() payload: JWTPayloadType,
  @Param('id', ParseIntPipe) productId: number,
) {
  return await this.cartService.increaseQuantity(payload.id, productId);
}

@Roles(userType.NORMAL_USER, userType.ADMIN)
@UseGuards(AuthRolesGuard)
@Post('/decrease/:id')
public async decreaseQuantity(
  @CurrentUser() payload: JWTPayloadType,
  @Param('id', ParseIntPipe) productId: number,
) {
  return await this.cartService.decreaseQuantity(payload.id, productId);
}
}
