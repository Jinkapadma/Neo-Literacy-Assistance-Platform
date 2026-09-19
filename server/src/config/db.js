import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return mongoose.connection;
  }

  try {
    const connectionInstance = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    logger.info(`✅ MongoDB Connected successfully! DB Host: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`);

    mongoose.connection.on('error', err => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB connection disconnected');
    });

    return connectionInstance;
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    // Don't exit immediately in dev if DB is starting up; throw to let server handle
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB disconnected through app termination');
};
