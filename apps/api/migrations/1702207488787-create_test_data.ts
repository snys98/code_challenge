// Import your models here
import mongoose from 'mongoose'
import { UserSchema } from '../src/modules/user/user.entity'
export async function up(): Promise<void> {
  console.log(mongoose.connection);
  const userModel = mongoose.model('User', UserSchema)
  // Write migration here
  await userModel.create([{
    "username": "user",
    "password": "ee11cbb19052e40b07aac0ca060c23ee",
    "locked": false,
  },
  {
    "username": "admin",
    "password": "21232f297a57a5a743894a0e4a801fc3",
    "locked": false,
  }])
}

export async function down(): Promise<void> {
  // Write migration here
}
