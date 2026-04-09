import { CategoryService } from './category.service';
import { Controller, Get } from "@nestjs/common";

@Controller('/api/category')
export class CategoryController{

    constructor(
        private readonly categoryService:CategoryService
    ){}

    @Get()
    public getAllCategory(){
        return this.categoryService.getAllCategory();
    }

}