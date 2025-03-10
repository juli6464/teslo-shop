import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from 'src/products/entities';

@ApiTags('Files - Get and upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path );
  }

  @Post('product')
    @ApiResponse({ status: 201, description: 'product was created', type: Product})
    @ApiResponse({ status: 400, description: 'Bad request'})
    @ApiResponse({ status: 403, description: 'Forbidden. File related.'})
  @UseInterceptors(FileInterceptor('file', {
    fileFilter:  fileFilter,
    // limits:{ fileSize: 1000}
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File,
  ) {

    if( !file) {
      throw new BadRequestException('make sure that the file is an image ');
    }

    // const secureUrl = `${ file.filename}`;
    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${file.filename}`;

    return {
      secureUrl,
    };
  }
}
