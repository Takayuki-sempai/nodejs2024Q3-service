import { LoggingService } from './logging/logging.service';

export const setupGlobalErrorListeners = (logger: LoggingService) => {
  process.on('uncaughtException', (error) => {
    const errorMessage = error.message
      ? error.message
      : 'Uncaught Error occurred';

    logger.fatal(errorMessage, 'uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    const message = reason instanceof Error ? reason.message : reason;
    logger.fatal(message, 'unhandledRejection');
  });
};
