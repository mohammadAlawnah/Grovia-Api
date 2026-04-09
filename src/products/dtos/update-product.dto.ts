import { IsString, IsNumber, IsNotEmpty,Min, MinLength, MaxLength, Max, Length, IsOptional } from "class-validator";

export class UpdateProductDto {
    @IsString({message: "title should be string"})
    @IsNotEmpty({message: "this is coustom message"})
    @Length(2,100)
    @IsOptional()
    title?: string;

    
    @IsString()
    @IsOptional()
    @MinLength(5)
    description?: string;

    @IsNumber({},{message: 'price should be number'})
    @IsNotEmpty()
    @Min(0,{message: 'price should not be less than zero'})
    @Max(1000)
    @IsOptional()
    price?:number;
}



