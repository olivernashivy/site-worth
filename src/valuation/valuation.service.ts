import { Injectable } from '@nestjs/common';
import { DomainService } from '../domain/domain.service';
import {
  DomainResultDto,
  TrafficEstimate,
  ValueEstimate,
  MonetizationEstimate,
  DomainInfo,
} from '../common/dto/domain-result.dto';

@Injectable()
export class ValuationService {
  constructor(private readonly domainService: DomainService) {}

  /**
   * Main method to calculate website worth and all related metrics
   */
  async calculateWebsiteWorth(domain: string): Promise<DomainResultDto> {
    // Get domain information
    const domainInfo = await this.domainService.getDomainInfo(domain);

    // Calculate traffic estimates
    const traffic = this.estimateTraffic(domain, domainInfo);

    // Calculate monetization potential
    const monetization = this.estimateMonetization(traffic, domainInfo);

    // Calculate website value
    const value = this.calculateValue(monetization, traffic);

    // Generate verdict
    const verdict = this.generateVerdict(value, traffic, monetization);

    // Generate related searches
    const relatedSearches = this.generateRelatedSearches(domain);

    return {
      domain,
      traffic,
      value,
      monetization,
      domainInfo: {
        domain,
        age: domainInfo.age,
        httpsEnabled: domainInfo.httpsEnabled,
        serverLocation: domainInfo.serverLocation,
        cms: domainInfo.cms,
      },
      verdict,
      relatedSearches,
      calculatedAt: new Date(),
    };
  }

  /**
   * Estimate monthly traffic based on domain characteristics
   * Uses realistic estimation model based on industry standards
   */
  private estimateTraffic(domain: string, domainInfo: any): TrafficEstimate {
    // Base traffic estimation - much higher realistic values
    let baseTraffic = 50000; // Default base monthly visitors
    let multiplier = 1;

    // Adjust based on domain extension
    const tld = domain.split('.').pop();
    if (tld === 'com') multiplier *= 3.0; // .com gets 3x boost
    else if (tld === 'org') multiplier *= 2.2;
    else if (tld === 'net' || tld === 'io') multiplier *= 2.0;
    else if (tld === 'edu' || tld === 'gov') multiplier *= 2.5;
    else multiplier *= 1.5;

    // Adjust based on domain age (if available)
    if (domainInfo.age) {
      const ageYears = this.parseAgeToYears(domainInfo.age);
      if (ageYears > 10) multiplier *= 4.0;
      else if (ageYears > 5) multiplier *= 3.0;
      else if (ageYears > 2) multiplier *= 2.0;
      else if (ageYears > 1) multiplier *= 1.5;
    } else {
      // If age unknown, assume moderate age
      multiplier *= 2.0;
    }

    // Adjust based on HTTPS
    if (domainInfo.httpsEnabled) multiplier *= 1.5;

    // Domain name quality boost (shorter = better)
    const domainLength = domain.split('.')[0].length;
    if (domainLength <= 6) multiplier *= 2.5;
    else if (domainLength <= 10) multiplier *= 1.8;
    else if (domainLength <= 15) multiplier *= 1.3;

    // Calculate visitor range with realistic spreads
    const lowVisitors = Math.round(baseTraffic * multiplier * 1.5);
    const highVisitors = Math.round(baseTraffic * multiplier * 5.0);

    // Calculate pageviews (average 2.5-5 pages per visitor)
    const lowPageviews = Math.round(lowVisitors * 2.5);
    const highPageviews = Math.round(highVisitors * 5);

    // Estimate global rank (inverse relationship with traffic)
    const avgTraffic = (lowVisitors + highVisitors) / 2;
    const globalRank = Math.round(50000000 / Math.sqrt(avgTraffic));

    return {
      monthlyVisitors: {
        low: lowVisitors,
        high: highVisitors,
      },
      monthlyPageviews: {
        low: lowPageviews,
        high: highPageviews,
      },
      globalRank: Math.max(1, globalRank), // Never below 1
    };
  }

  /**
   * Estimate monetization potential based on traffic and domain info
   * Uses industry-standard RPM ranges
   */
  private estimateMonetization(
    traffic: TrafficEstimate,
    domainInfo: any,
  ): MonetizationEstimate {
    const avgVisitors =
      (traffic.monthlyVisitors.low + traffic.monthlyVisitors.high) / 2;

    let potential: 'Low' | 'Medium' | 'High';
    let rpmLow = 3;
    let rpmHigh = 10;

    // Determine potential based on traffic volume - more realistic thresholds
    if (avgVisitors > 500000) {
      potential = 'High';
      rpmLow = 15;
      rpmHigh = 50;
    } else if (avgVisitors > 100000) {
      potential = 'High';
      rpmLow = 10;
      rpmHigh = 35;
    } else if (avgVisitors > 50000) {
      potential = 'Medium';
      rpmLow = 8;
      rpmHigh = 25;
    } else if (avgVisitors > 20000) {
      potential = 'Medium';
      rpmLow = 5;
      rpmHigh = 18;
    } else {
      potential = 'Low';
      rpmLow = 3;
      rpmHigh = 12;
    }

    // Adjust based on HTTPS (better for ads)
    if (domainInfo.httpsEnabled) {
      rpmLow = Math.round(rpmLow * 1.2);
      rpmHigh = Math.round(rpmHigh * 1.3);
    }

    // Adjust based on TLD (premium TLDs get better rates)
    const tld = domainInfo.domain?.split('.').pop();
    if (tld === 'com' || tld === 'org') {
      rpmHigh = Math.round(rpmHigh * 1.2);
    }

    // Best monetization methods based on potential
    const bestMethods =
      potential === 'High'
        ? ['Direct Ad Sales', 'Premium Ad Networks', 'Affiliate Marketing', 'Sponsored Content', 'Email Marketing']
        : potential === 'Medium'
        ? ['Google AdSense', 'Affiliate Marketing', 'Sponsored Posts', 'Display Advertising']
        : ['Google AdSense', 'Affiliate Marketing', 'Contextual Ads'];

    return {
      potential,
      rpmRange: {
        low: rpmLow,
        high: rpmHigh,
      },
      bestMethods,
    };
  }

  /**
   * Calculate website value based on revenue potential
   * Value = Monthly Revenue × 36-60 months (industry standard)
   */
  private calculateValue(
    monetization: MonetizationEstimate,
    traffic: TrafficEstimate,
  ): ValueEstimate {
    // Calculate revenue using RPM (Revenue Per Mille / 1000 pageviews)
    const lowPageviews = traffic.monthlyPageviews.low;
    const highPageviews = traffic.monthlyPageviews.high;

    // Monthly revenue = (Pageviews / 1000) × RPM
    const lowMonthlyRevenue = (lowPageviews / 1000) * monetization.rpmRange.low;
    const highMonthlyRevenue = (highPageviews / 1000) * monetization.rpmRange.high;

    // Daily revenue
    const lowDailyRevenue = lowMonthlyRevenue / 30;
    const highDailyRevenue = highMonthlyRevenue / 30;

    // Website value = Monthly revenue × 36-60 months (more realistic multiplier)
    // High traffic sites get higher multipliers
    const avgVisitors = (traffic.monthlyVisitors.low + traffic.monthlyVisitors.high) / 2;
    const lowMultiplier = avgVisitors > 100000 ? 40 : 36;
    const highMultiplier = avgVisitors > 100000 ? 72 : 60;

    const lowValue = lowMonthlyRevenue * lowMultiplier;
    const highValue = highMonthlyRevenue * highMultiplier;

    return {
      estimatedValue: {
        low: Math.round(lowValue),
        high: Math.round(highValue),
      },
      dailyRevenue: {
        low: parseFloat(lowDailyRevenue.toFixed(2)),
        high: parseFloat(highDailyRevenue.toFixed(2)),
      },
      monthlyRevenue: {
        low: Math.round(lowMonthlyRevenue),
        high: Math.round(highMonthlyRevenue),
      },
    };
  }

  /**
   * Generate a human-readable verdict about the website
   */
  private generateVerdict(
    value: ValueEstimate,
    traffic: TrafficEstimate,
    monetization: MonetizationEstimate,
  ): string {
    const avgValue = (value.estimatedValue.low + value.estimatedValue.high) / 2;
    const avgVisitors = (traffic.monthlyVisitors.low + traffic.monthlyVisitors.high) / 2;

    let verdict = '';

    if (avgValue > 50000) {
      verdict = `This website shows strong value with an estimated worth between $${this.formatNumber(value.estimatedValue.low)} and $${this.formatNumber(value.estimatedValue.high)}. `;
    } else if (avgValue > 10000) {
      verdict = `This website has moderate value, estimated between $${this.formatNumber(value.estimatedValue.low)} and $${this.formatNumber(value.estimatedValue.high)}. `;
    } else {
      verdict = `This website has developing potential with an estimated value of $${this.formatNumber(value.estimatedValue.low)} to $${this.formatNumber(value.estimatedValue.high)}. `;
    }

    if (monetization.potential === 'High') {
      verdict += `With ${this.formatNumber(Math.round(avgVisitors))} monthly visitors and high monetization potential, this site could generate significant revenue through display advertising and premium partnerships.`;
    } else if (monetization.potential === 'Medium') {
      verdict += `With approximately ${this.formatNumber(Math.round(avgVisitors))} monthly visitors, the site has good growth potential through strategic monetization.`;
    } else {
      verdict += `The site receives around ${this.formatNumber(Math.round(avgVisitors))} monthly visitors. Focus on growing traffic to increase monetization opportunities.`;
    }

    return verdict;
  }

  /**
   * Generate related domain searches for internal linking
   */
  private generateRelatedSearches(domain: string): string[] {
    const parts = domain.split('.');
    const domainName = parts[0];

    // Generate variations
    const related: string[] = [];

    // Add some common related domains (for demo purposes)
    if (domainName.length > 5) {
      const substring = domainName.substring(0, 5);
      related.push(`${substring}*.com`);
    }

    // Add TLD variations
    const baseName = parts.slice(0, -1).join('.');
    ['com', 'net', 'org', 'io'].forEach((tld) => {
      if (!domain.endsWith(`.${tld}`)) {
        related.push(`${baseName}.${tld}`);
      }
    });

    return related.slice(0, 5);
  }

  /**
   * Parse age string to years
   */
  private parseAgeToYears(age: string): number {
    if (!age) return 0;

    const yearMatch = age.match(/(\d+)\s*year/i);
    if (yearMatch) {
      return parseInt(yearMatch[1]);
    }

    const monthMatch = age.match(/(\d+)\s*month/i);
    if (monthMatch) {
      return parseInt(monthMatch[1]) / 12;
    }

    return 0;
  }

  /**
   * Format large numbers with commas
   */
  private formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
