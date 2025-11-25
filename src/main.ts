import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig, CorsConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<ServerConfig>);
  const port = config.get<number>('port')!;
  const cors = config.get<CorsConfig>('cors')!;

  await app.listen(port);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: cors.origins,
    maxAge: cors.maxAge,
  });
}
bootstrap();
