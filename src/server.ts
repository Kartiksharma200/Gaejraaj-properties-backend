import 'module-alias/register';
import App from './app';
import { logger } from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

try {
  // Create server instance
  const app = new App();
  const server = app.listen();

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any) => {
    logger.error(`Unhandled Rejection: ${reason.message || reason}`);
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    logger.info('Received shutdown signal. Shutting down gracefully...');
    
    if (server && typeof server.close === 'function') {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  // Handle termination signals
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

} catch (error: any) {
  logger.error(`Failed to start server: ${error.message}`);
  process.exit(1);
}