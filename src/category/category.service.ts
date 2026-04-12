import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository:Repository<Category>,
    ){}

    public async getAllCategory(){
        const category = await this.categoryRepository.find({
            relations: ['products'],
        });
        return{message:"succsess",category:category}
    }

    public async getCategory(categoryName :string){
        const category = await this.categoryRepository.findOne({where:{name : categoryName}});
        if(!category)
            throw new NotFoundException("CategoryNotFound")

        return {message:"success",category:category}
    }


}
