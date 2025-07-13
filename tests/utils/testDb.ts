import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// For Jest global setup
export default async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  
  await mongoose.connect(uri);
  console.log('Test DB connected:', uri);

  return async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  };
};

// For test file usage
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const setupTestEnvironment = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};

export async function createTestUser() {
  return await User.create({
    email: 'test@example.com',
    password: 'hashedpassword'
  });
}