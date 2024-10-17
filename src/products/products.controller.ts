import { Controller, Post, Get, Put, Delete, Param, Body, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { User as UserEntity } from '../users/models/user.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '../common/user.decorator';
import { validate } from 'class-validator';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get()
    async getAllProducts(
        @Query('keyword') keyword: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @User() user: UserEntity,
    ) {
        const parsedStartDate = startDate ? new Date(startDate) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        return this.productService.getAllProducts(keyword, parsedStartDate, parsedEndDate, pageNumber, pageSize, user);
    }

    @Get(':id')
    async getProductById(@Param('id') productId: string) {
        return this.productService.getProductById(productId);
    }

    @UseGuards(RolesGuard)
    @Roles('user')
    @Post()
    @UseInterceptors(FileInterceptor('image')) // Handle file upload
    async createProduct(
        @UploadedFile() image: Express.Multer.File,
        @Body() productDto: CreateProductDto,
        @User() user: UserEntity,
    ) {
        if (image) {
            productDto.image = image;
        } else {
            throw new BadRequestException('Image file is required.');
        }
        const errors = await validate(productDto);
        if (errors.length > 0) {
            const formattedErrors = this.formatValidationErrors(errors);
            throw new BadRequestException(formattedErrors);
        }
        return this.productService.createProduct(productDto, user);
    }
    
    @UseGuards(RolesGuard)
    @Roles('user')
    @Put(':id')
    @UseInterceptors(FileInterceptor('image')) // Handle file upload
    async updateProduct(
        @Param('id') productId: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() updateProductDto: UpdateProductDto,
        @User() user: UserEntity,
    ) {
        if (image) {
            updateProductDto.image = image;
        }
        const errors = await validate(updateProductDto);
        if (errors.length > 0) {
            const formattedErrors = this.formatValidationErrors(errors);
            throw new BadRequestException(formattedErrors);
        }
        return this.productService.updateProduct(productId, updateProductDto, user);
    }

    @UseGuards(RolesGuard)
    @Roles('user')
    @Delete(':id')
    async deleteProduct(@Param('id') productId: string, @User() user : UserEntity) {
        return this.productService.deleteProduct(productId, user);
    }

    private formatValidationErrors(errors: any[]): string {
        return errors
            .map(error => {
            const constraints = Object.values(error.constraints || {}).join(', ');
            return `${constraints}`;
            })
            .join('; ');
    }
}
