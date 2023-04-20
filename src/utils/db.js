import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

const connectToMongo = async () => {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
  const db = mongoose.connection;

  console.log('Connected to MongoDB');
  return db;
};

export default connectToMongo;
