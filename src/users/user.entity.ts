import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { userType } from '../utils/enums';
import { Exclude } from 'class-transformer';
import { Cart } from '../cart/cart.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: userType, default: userType.NORMAL_USER })
  usertype: userType;

  @Column({ default: false })
  isAccountVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'int', nullable: true })
  resetPasswordCode: number | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @Column({ default: false })
  isResetCodeVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToOne(()=> User, (user)=>user.cart)
  cart: Cart;
}
