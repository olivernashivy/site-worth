import { Injectable } from '@nestjs/common';
import { DomainResultDto } from '../common/dto/domain-result.dto';

interface SeoData {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
}

@Injectable()
export class SeoService {
  /**
   * Generate SEO meta tags for a domain result page
   */
  generateSeoData(result: DomainResultDto): SeoData {
    const domain = result.domain;
    const valueLow = this.formatCurrency(result.value.estimatedValue.low);
    const valueHigh = this.formatCurrency(result.value.estimatedValue.high);

    const title = `${domain} Worth: ${valueLow} - ${valueHigh} | Website Value Calculator`;
    const description = `${domain} is estimated to be worth ${valueLow} to ${valueHigh} with ${this.formatNumber(result.traffic.monthlyVisitors.low)} - ${this.formatNumber(result.traffic.monthlyVisitors.high)} monthly visitors. Free website worth analysis.`;

    const canonicalUrl = `${process.env.SITE_URL}/website-worth/${domain}`;

    return {
      title,
      description,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      ogUrl: canonicalUrl,
      ogType: 'website',
    };
  }

  /**
   * Generate Schema.org structured data for SEO
   */
  generateSchemaMarkup(result: DomainResultDto): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: result.domain,
      url: `https://${result.domain}`,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${process.env.SITE_URL}/website-worth/{domain}`,
        },
        'query-input': 'required name=domain',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: this.calculateRatingFromValue(result.value.estimatedValue.high),
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'Offer',
        price: result.value.estimatedValue.low,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    };

    return JSON.stringify(schema);
  }

  /**
   * Calculate a rating (1-5) based on estimated value
   */
  private calculateRatingFromValue(value: number): string {
    if (value > 100000) return '5';
    if (value > 50000) return '4.5';
    if (value > 20000) return '4';
    if (value > 10000) return '3.5';
    if (value > 5000) return '3';
    return '2.5';
  }

  /**
   * Format number with commas
   */
  private formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Format currency
   */
  private formatCurrency(num: number): string {
    return `$${this.formatNumber(num)}`;
  }
}
