import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartController } from "./cart.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ProductModule } from "src/products/products.module";
import { CartItem } from "./cart-item/cart-item.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Cart]),TypeOrmModule.forFeature([CartItem]),UsersModule,JwtModule,ProductModule],
    controllers:[CartController],
    providers:[CartService],
    exports : [CartService],
})
export class CartModule{};