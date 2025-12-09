import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { delay } from 'rxjs/operators';
import { AuthConfig, type ServerConfig } from '../../config/configuration';
import { Observable } from 'rxjs';

@Injectable()
export class AuthDelayInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService<ServerConfig>) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    const authConfig = this.configService.get<AuthConfig>('auth')!;
    const maxDelay = authConfig.maxDelay;
    const randomDelay = Math.round(Math.random() * maxDelay);
    return next.handle().pipe(delay(randomDelay));
  }
}
