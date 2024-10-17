import { Schema, Document } from 'mongoose';

export const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, minlength: 10, maxlength: 200 },
  imageUrl: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export interface Product extends Document {
  name: string;
  description: string;
  imageUrl: string;
  isDeleted: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}