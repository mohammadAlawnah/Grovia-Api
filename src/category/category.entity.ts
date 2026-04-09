import { Product } from "src/products/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'cagegory'})
export class Category{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar"})
    name:string

    @Column({type:'varchar'})
    img:string;

    @OneToMany(()=>Product,(product)=>product.category)
    products: Product[];

}