import { ConsoleLogger, Injectable } from '@nestjs/common';
import { isAbsolute, join } from 'node:path';
import { dirname } from 'node:path';
import {
  appendFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from 'node:fs';
import { mkdirSync } from 'fs';

enum LogLevel {
  FATAL = 0,
  ERROR = 1,
  WARN = 2,
  LOG = 3,
  DEBUG = 4,
  VERBOSE = 5,
}

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logLevel: LogLevel = +process.env.LOG_LEVEL || LogLevel.ERROR;
  private maxSizeInBytes: number = (+process.env.MAX_FILE_SIZE || 1024) * 1024;
  private maxFiles: number = +process.env.MAX_FILE_NUMBER || 5;

  log(message: any, context?: string) {
    if (this.logLevel >= LogLevel.LOG) {
      this.logToFile(LogLevel.LOG, message, context || this.context);
      super.log(message, context || this.context);
    }
  }

  error(message: any, stackOrContext?: string) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.logToFile(LogLevel.ERROR, message, stackOrContext || this.context);
      super.error(message, stackOrContext || this.context);
    }
  }

  warn(message: any, context?: string) {
    if (this.logLevel >= LogLevel.WARN) {
      this.logToFile(LogLevel.WARN, message, context || this.context);
      super.warn(message, context || this.context);
    }
  }

  debug(message: any, context?: string) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.logToFile(LogLevel.DEBUG, message, context || this.context);
      super.debug(message, context || this.context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.logLevel >= LogLevel.VERBOSE) {
      this.logToFile(LogLevel.VERBOSE, message, context || this.context);
      super.verbose(message, context || this.context);
    }
  }

  fatal(message: any, context?: string) {
    if (this.logLevel >= LogLevel.FATAL) {
      this.logToFile(LogLevel.FATAL, message, context || this.context);
      super.fatal(message, context || this.context);
    }
  }

  private logToFile(level: LogLevel, message: any, context?: string) {
    const levelName = LogLevel[level];
    const dirName = process.env.LOG_DIR || 'logs';

    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'long',
    }).format(new Date())}\t${levelName}\t[${context}]\t${message}\n`;

    try {
      const dirPath = this.toAbsolutePath(dirName);
      const fileName = level <= LogLevel.ERROR ? 'error' : 'log';
      const filePath = join(dirPath, `${fileName}.log`);

      mkdirSync(dirPath, { recursive: true });
      appendFileSync(filePath, formattedEntry);

      const fileStat = statSync(filePath);
      if (fileStat.size > this.maxSizeInBytes) {
        const newFilePath = join(dirPath, `${fileName}_${Date.now()}.log`);
        renameSync(filePath, newFilePath);
      }

      const files = readdirSync(dirPath, { withFileTypes: true }).filter(
        (file) => file.name.endsWith('.log'),
      );
      if (files.length > this.maxFiles) {
        const sortedFiles = files
          .filter((file) => file.name.split('_').length > 1) //Exclude log.log and error.log
          .sort(
            (file1, file2) =>
              +this.getFileDate(file1.name) - +this.getFileDate(file2.name),
          );
        const deleteFileCount = files.length - this.maxFiles;
        for (let i = 0; i < deleteFileCount; i++) {
          rmSync(join(sortedFiles[i].parentPath, sortedFiles[i].name));
        }
      }
    } catch (error) {
      super.error(error.message);
    }
  }

  private getFileDate(fileName: string) {
    return fileName.replace('.log', '').replace('log', '').replace('error', '');
  }

  private toAbsolutePath = (filepath) =>
    isAbsolute(filepath)
      ? filepath
      : join(dirname(dirname(__dirname)), filepath);
}
