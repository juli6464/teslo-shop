import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '01eaf4c6-0635-42f2-88e9-05c1352ee4af',
        description: 'Product id',
        uniqueItems: true
     })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt teslo',
        description: 'Product title',
        uniqueItems: true
     })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: '0',
        description: 'Product price'
     })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'lorem ipsum',
        description: 'Product description',
        default: null
     })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug - for SEO',
        uniqueItems: true
     })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
     })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['S','M','L'],
        description: 'Product sizes',
     })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
     })
    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty({
        example: 'shirt',
        description: 'Product tag'
     })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    //tags
    @ApiProperty({
        example: 'https://teslo.com/image.jpg',
        description: 'Product img'
     })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug) {
            this.slug =this.title;
        }
        this.slug = this.slug
          .toLowerCase()
          .replaceAll(' ','_')
          .replaceAll("'",'')

    }
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }
}
