import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/product.model';
import { User } from 'src/users/models/user.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('Product') private productModel : Model<Product>,
        private firebaseService : FirebaseService
    ) {}

    async createProduct(productDto : CreateProductDto, user : User) : Promise<Product> {
        const { name, description, image } = productDto;
        const imageUrl = await this.firebaseService.uploadImage(image);
        const newProduct = new this.productModel({
            name,
            description,
            imageUrl,
            createdBy: user._id,
        });

        return newProduct.save();
    }

    // Get all products with filter and pagination
    async getAllProducts(keyword: string, startDate: Date, endDate: Date, page: number = 1, limit: number = 10, user: User): Promise<any> {
        const filter: any = { isDeleted: false }; // Only show non-deleted products

        if (keyword) {
        filter.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
        ];
        }

        if (startDate && endDate) {
        filter.createdAt = { $gte: startDate, $lte: endDate };
        }        
        if (user.role !== 'admin') {
            filter.createdBy = user._id;
        }

        const products = await this.productModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'fullName email') // Show creator details
        .exec();

        const totalProducts = await this.productModel.countDocuments(filter);

        return {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products,
        };
    }

    // Find product by ID
    async getProductById(productId: string): Promise<Product> {
        const product = await this.productModel.findById(productId).exec();
        if (!product || product.isDeleted) {
        throw new NotFoundException('Product not found or has been deleted.');
        }
        return product;
    }

    // Update a product
    async updateProduct(productId: string, productDto : UpdateProductDto, user : User): Promise<Product> {
        const existingProduct = await this.productModel.findById(productId);
        if (!existingProduct) {
            throw new NotFoundException('Product not found.');
        }
        if (existingProduct.createdBy.toString() !== user.id.toString()) {
            throw new ForbiddenException('You are not authorized to update this product.');
        }
        if (productDto.image) {
            productDto.imageUrl = await this.firebaseService.uploadImage(productDto.image); 
            await this.firebaseService.deleteImage(existingProduct.imageUrl); 
        }
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            productId,
            productDto,
            { new: true, runValidators: true  },
        );
        if (!updatedProduct) {
            throw new NotFoundException('Product not found.');
        }

        return updatedProduct;
    }

    // Soft delete a product
    async deleteProduct(productId: string, user : User): Promise<void> {
        const existingProduct = await this.productModel.findById(productId);
        if (!existingProduct) {
            throw new NotFoundException('Product not found.');
        }
        if (existingProduct.createdBy.toString() !== user.id.toString()) {
            throw new ForbiddenException('You are not authorized to delete this product.');
        }
        const product = await this.productModel.findByIdAndUpdate(
            productId,
            { isDeleted: true },
        );
        if (!product) {
            throw new NotFoundException('Product not found.');
        }
    }
}
