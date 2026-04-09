import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './cart-item/cart-item.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items : CartItem[]; 


  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;
}
