import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValuationModule } from './valuation/valuation.module';
import { DomainModule } from './domain/domain.module';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Configure in-memory caching
    CacheModule.register({
      isGlobal: true,
      ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour default
      max: 1000, // Maximum number of items in cache
    }),
    ValuationModule,
    DomainModule,
    SeoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
