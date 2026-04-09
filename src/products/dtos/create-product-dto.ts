import { IsString, IsNumber, IsNotEmpty,Min, MinLength, MaxLength, Max, Length } from "class-validator";
export class CreateProductDto {
    @IsString({message: "title should be string"})
    @IsNotEmpty({message: "this is coustom message"})
    @Length(2,100)
    title: string;

    @IsString()
    @MinLength(5)
    description: string;

    @IsNumber({},{message: 'price should be number'})
    @IsNotEmpty()
    @Min(0,{message: 'price should not be less than zero'})
    @Max(1000)
    price:number;

}


