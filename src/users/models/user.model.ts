import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    fullName: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Prop({ default: true })
    isActive: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);