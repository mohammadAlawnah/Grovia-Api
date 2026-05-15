import { CartItem } from './../cart/cart-item/cart-item.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../utils/constants';

import { Review } from '../reviews/review.entity';
import { User } from '../users/user.entity';
import { Category } from '../category/category.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column()
  quantity : number;

  @Column({ type: 'varchar', length: 150 })
  unit : string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar' })
  img: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @Column({ type: 'varchar', length: 100, nullable: true })
brand: string;

@Column({ type: 'boolean', default: true })
isActive: boolean;

@Column({ type: 'int', default: 0 })
stockQuantity: number;

@Column({ type: 'int', nullable: true })
calories: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
protein: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
carbs: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
fat: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
sugar: number;

@Column({ type: 'boolean', default: false })
isVegan: boolean;

@Column({ type: 'boolean', default: false })
isSugarFree: boolean;

@Column({ type: 'boolean', default: false })
isLowCalorie: boolean;

@Column('text', { array: true, nullable: true })
tags: string[];
}

// ()=> Review, (review)=>review.product
