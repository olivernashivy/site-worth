import { Controller, Get, Param, Render, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ValuationService } from './valuation.service';
import { DomainService } from '../domain/domain.service';
import { SeoService } from '../seo/seo.service';
import { DomainResultDto } from '../common/dto/domain-result.dto';

@Controller('website-worth')
export class ValuationController {
  constructor(
    private readonly valuationService: ValuationService,
    private readonly domainService: DomainService,
    private readonly seoService: SeoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(':domain')
  @Render('result')
  async getWebsiteWorth(@Param('domain') domain: string) {
    // Normalize domain
    const normalizedDomain = this.normalizeDomain(domain);

    // Check cache first
    const cacheKey = `valuation:${normalizedDomain}`;
    let result: DomainResultDto = await this.cacheManager.get(cacheKey);

    if (!result) {
      // Calculate fresh valuation
      result = await this.valuationService.calculateWebsiteWorth(normalizedDomain);

      // Cache the result
      await this.cacheManager.set(cacheKey, result);
    }

    // Generate SEO data
    const seoData = this.seoService.generateSeoData(result);
    const schemaMarkup = this.seoService.generateSchemaMarkup(result);

    return {
      ...seoData,
      result,
      schemaMarkup,
      siteName: process.env.SITE_NAME,
      siteUrl: process.env.SITE_URL,
    };
  }

  private normalizeDomain(domain: string): string {
    // Remove protocol
    domain = domain.replace(/^https?:\/\//, '');
    // Remove www
    domain = domain.replace(/^www\./, '');
    // Remove trailing slash and path
    domain = domain.split('/')[0];
    // Convert to lowercase
    domain = domain.toLowerCase();
    return domain;
  }
}
