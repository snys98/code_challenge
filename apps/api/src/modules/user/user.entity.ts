import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    locked: Boolean,
});

export interface User extends mongoose.Document {
    username: string;
    password: string;
    locked: boolean;
}  
