import { Category } from "src/category/category.entity";
import { Product } from "../src/products/product.entity";
import { User } from "../src/users/user.entity";
import { DataSource , DataSourceOptions } from "typeorm";
import { Review } from "../src/reviews/review.entity";
import { Migration } from "typeorm/browser";
import {config} from "dotenv"
import { Cart } from "src/cart/cart.entity";
import { CartItem } from "src/cart/cart-item/cart-item.entity";

// dotenv config
config({path:'.env'})

// data sourse option 
export const dataSourceOptions: DataSourceOptions = {
    type:'postgres',
    url : process.env.DATABASE_URL,
    entities:[User,Product,Category,Review,Cart,CartItem],
    migrations :["dist/DB/migrations/*.js"]
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;