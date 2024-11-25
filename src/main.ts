import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as Yaml from 'yaml';
import 'dotenv/config';
import { SwaggerModule } from '@nestjs/swagger';
import { ExceptionFilter } from './exception/exception.filter';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = Yaml.parse(
    (await readFile(join(process.cwd(), 'doc/api.yaml'))).toString('utf-8'),
  );
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, strictGroups: true }),
  );
  app.useGlobalFilters(new ExceptionFilter());
  app.useLogger(app.get(LoggingService));
  const port = +process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
