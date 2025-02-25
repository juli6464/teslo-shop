import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        example: 'Product title (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 30
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'Product description'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'product-title'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 10
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: ['S','M','L','XL']
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'men'
    })
    @IsIn(['men','women','kid','unisex'])
    gender: string;

    @ApiProperty({
        example: 'men'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        example: 'http://example.com/image.jpg'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
