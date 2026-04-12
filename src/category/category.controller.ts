import { CategoryService } from './category.service';
import { Controller, Get, Param } from "@nestjs/common";

@Controller('/api/category')
export class CategoryController{

    constructor(
        private readonly categoryService:CategoryService
    ){}

    @Get()
    public getAllCategory(){
        return this.categoryService.getAllCategory();
    }

    @Get(":categoryName")
    public getCategory(@Param("categoryName") categoryName:string){
        return this.categoryService.getCategory(categoryName);

    }

}
