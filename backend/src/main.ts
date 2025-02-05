import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AppConfigService } from './config/config.service';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');

  // Interceptors
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Pipe
  app.useGlobalPipes(new ValidationPipe());

  // Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(AppConfigService);
  const port = configService.port;

  await app.init(); // Initialize the app (important in serverless functions)
  console.log(`🚀 Server is running on http://localhost:${port}`);
  return server; // Return the Express server, needed for Vercel handler
}

bootstrap().then((server) => {
  module.exports = server; // Export the server for Vercel
});
