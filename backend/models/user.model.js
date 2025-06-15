import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: false }
);

export const userModel = model('users', userSchema);
