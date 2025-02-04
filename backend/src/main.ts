import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // 3, 7. Interceptor
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 4. Pipe
  app.useGlobalPipes(new ValidationPipe());

  // 8. Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(AppConfigService);
  const port = configService.port;

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
