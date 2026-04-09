import { Roles } from 'src/users/decorators/user-role.decorator';
import { CartService } from './cart.service';
import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { userType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(userType.NORMAL_USER, userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Post("/:id")
  public async addProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Param("id" , ParseIntPipe) productId:number
) {
    return await this.cartService.addToCart(payload.id,productId);
  }
}
