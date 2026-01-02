import { Module } from '@nestjs/common';
import { ValuationController } from './valuation.controller';
import { ValuationService } from './valuation.service';
import { DomainModule } from '../domain/domain.module';
import { SeoModule } from '../seo/seo.module';

@Module({
  imports: [DomainModule, SeoModule],
  controllers: [ValuationController],
  providers: [ValuationService],
  exports: [ValuationService],
})
export class ValuationModule {}
