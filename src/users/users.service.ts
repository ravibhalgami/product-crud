import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import { SignUpDto } from 'src/auth/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel : Model<User>
    ){}

    async createUser(signUpDto : SignUpDto) : Promise<User> {
        const newUser = new this.userModel(signUpDto);
        return newUser.save();
    }

    async findByEmail(email : string) : Promise<User | null> {
        return this.userModel.findOne({email : email}).exec();
    }

    async findById(userId:string) : Promise<User| null> {
        return this.userModel.findById(userId).exec();
    }

    async markUserActiveStatus(userId: string, isActive: boolean): Promise<User> {
        return this.userModel.findByIdAndUpdate(userId, { isActive }, { new: true }).exec();
    }

    async createAdmin(fullName: string, phoneNumber:number, email: string, password: string): Promise<User> {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = new this.userModel({
          fullName,
          phoneNumber,
          email,
          password: hashedPassword,
          isAdmin: true,
        });
    
        return newAdmin.save();
      }

    async findAllUsers(keyword: string, startDate: Date, endDate: Date, page: number = 1, limit: number = 10): Promise<any> {
        const filter: any = {};
    
        if (keyword) {
          filter.$or = [
            { fullName: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
            { phoneNumber: { $regex: keyword, $options: 'i' } },
          ];
        }
    
        if (startDate && endDate) {
          filter.createdAt = { $gte: startDate, $lte: endDate };
        }

        const users = await this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

        const totalUsers = await this.userModel.countDocuments(filter);

        return {
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            users,
        };
    }
}
