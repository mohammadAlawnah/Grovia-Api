import { CartItem } from './cart/cart-item/cart-item.entity';
import { Module } from '@nestjs/common';
import { ProductModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';
import { dataSourceOptions } from '../DB/data-source';
import { CartModule } from './cart/cart.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    UsersModule,
    MailModule,
    ReviewModule,
    CartModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV !== 'production'? `.env.${process.env.NODE_ENV}` : ".env"
    }),
  ],
  exports: [],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}


// import { Module } from '@nestjs/common';
// import { ProductModule } from './products/products.module';
// import { UsersModule } from './users/users.module';
// import { ReviewModule } from './reviews/reviews.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Product } from './products/product.entity';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { config } from 'process';
// import { User } from './users/user.entity';
// import { Review } from './reviews/review.entity';
// import { MailModule } from './mail/mail.module';
// import { CategoryModule } from './category/category.module';
// import { Category } from './category/category.entity';
// import { dataSourceOptions } from '../DB/data-source';
// import { CartModule } from './cart/cart.module';
// import { Cart } from './cart/cart.entity';

// @Module({
//   imports: [
//     ProductModule,
//     CategoryModule,
//     UsersModule,
//     MailModule,
//     ReviewModule,
//     CartModule,
//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         return {
//           type: 'postgres',
//           database: config.get<string>("DB_DATABASE"),
//           username: config.get<string>("DB_USERNAME"),
//           password: config.get<string>("DB_PASSWORD"),
//           port: config.get<number>("DB_PORT"),
//           host: 'localhost',
//           synchronize: process.env.NODE_ENV !== 'production',
//           entities: [Product , User , Review,Category,Cart,CartItem],
//         };
//       },
//     }),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: `.env.${process.env.NODE_ENV}`,
//     }),
//   ],
//   exports: [],
//   providers: [],
//   controllers: [],
// })
// export class AppModule {}



/* Local Database */ 
// {
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         return {
//           type: 'postgres',
//           database: config.get<string>("DB_DATABASE"),
//           username: config.get<string>("DB_USERNAME"),
//           password: config.get<string>("DB_PASSWORD"),
//           port: config.get<number>("DB_PORT"),
//           host: 'localhost',
//           synchronize: process.env.NODE_ENV !== 'production',
//           entities: [Product , User , Review,Category],
//         };
//       },
//     }