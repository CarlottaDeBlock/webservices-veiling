import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig, CorsConfig, LogConfig } from './config/configuration';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import CustomLogger from './core/customLogger';
import { HttpExceptionFilter } from './lib/http-exception.filter';
import { DrizzleQueryErrorFilter } from './drizzle/drizzle-query-error.filter';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<ServerConfig>);
  const port = config.get<number>('port')!;
  const cors = config.get<CorsConfig>('cors')!;
  const log = config.get<LogConfig>('log')!;

  app.use(helmet());

  app.useLogger(
    new CustomLogger({
      logLevels: log.levels,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DrizzleQueryErrorFilter(),
  );
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,

      exceptionFactory: (errors: ValidationError[] = []) => {
        const formattedErrors = errors.reduce(
          (acc, err) => {
            acc[err.property] = Object.values(err.constraints || {});
            return acc;
          },
          {} as Record<string, string[]>,
        );

        return new BadRequestException({
          details: { body: formattedErrors },
        });
      },
    }),
  );

  app.enableCors({
    origin: cors.origins,
    maxAge: cors.maxAge,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auction Web Services')
    .setDescription('The Auction API application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);
  await app.listen(port, () => {
    new Logger().log(`🚀 Server listening on http://127.0.0.1:${port}`);
  });
}
bootstrap();
