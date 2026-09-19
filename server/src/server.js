import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Literacy Assistance Platform Server running in [${env.NODE_ENV}] mode on port: ${env.PORT}`);
      logger.info(`🔗 API Base URL: http://localhost:${env.PORT}/api`);
    });

    const shutdown = async signal => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        logger.info('Exiting process.');
        process.exit(0);
      });

      // Force shutdown after 10s if dangling connections
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', error => {
      logger.error('Uncaught Exception thrown:', error);
      shutdown('UNCAUGHT_EXCEPTION');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
