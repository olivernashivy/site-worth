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
   * Uses a simplified estimation model for consistency
   */
  private estimateTraffic(domain: string, domainInfo: any): TrafficEstimate {
    // Base traffic estimation using domain characteristics
    let baseTraffic = 5000; // Default base
    let multiplier = 1;

    // Adjust based on domain extension
    const tld = domain.split('.').pop();
    if (tld === 'com') multiplier *= 1.5;
    else if (tld === 'org' || tld === 'net') multiplier *= 1.2;

    // Adjust based on domain age (if available)
    if (domainInfo.age) {
      const ageYears = this.parseAgeToYears(domainInfo.age);
      if (ageYears > 5) multiplier *= 2;
      else if (ageYears > 2) multiplier *= 1.5;
      else if (ageYears > 1) multiplier *= 1.2;
    }

    // Adjust based on HTTPS
    if (domainInfo.httpsEnabled) multiplier *= 1.2;

    // Calculate visitor range
    const lowVisitors = Math.round(baseTraffic * multiplier * 0.8);
    const highVisitors = Math.round(baseTraffic * multiplier * 2.5);

    // Calculate pageviews (average 2-4 pages per visitor)
    const lowPageviews = Math.round(lowVisitors * 2);
    const highPageviews = Math.round(highVisitors * 4);

    // Estimate global rank (inverse relationship with traffic)
    const globalRank = Math.round(10000000 / (baseTraffic * multiplier));

    return {
      monthlyVisitors: {
        low: lowVisitors,
        high: highVisitors,
      },
      monthlyPageviews: {
        low: lowPageviews,
        high: highPageviews,
      },
      globalRank,
    };
  }

  /**
   * Estimate monetization potential based on traffic and domain info
   */
  private estimateMonetization(
    traffic: TrafficEstimate,
    domainInfo: any,
  ): MonetizationEstimate {
    const avgVisitors =
      (traffic.monthlyVisitors.low + traffic.monthlyVisitors.high) / 2;

    let potential: 'Low' | 'Medium' | 'High';
    let rpmLow = 1;
    let rpmHigh = 5;

    // Determine potential based on traffic volume
    if (avgVisitors > 100000) {
      potential = 'High';
      rpmLow = 5;
      rpmHigh = 15;
    } else if (avgVisitors > 20000) {
      potential = 'Medium';
      rpmLow = 3;
      rpmHigh = 10;
    } else {
      potential = 'Low';
      rpmLow = 1;
      rpmHigh = 5;
    }

    // Adjust based on HTTPS (better for ads)
    if (domainInfo.httpsEnabled && potential === 'Medium') {
      rpmHigh += 2;
    }

    // Best monetization methods based on potential
    const bestMethods =
      potential === 'High'
        ? ['Display Ads (Google AdSense)', 'Direct Ad Sales', 'Affiliate Marketing', 'Sponsored Content']
        : potential === 'Medium'
        ? ['Display Ads (Google AdSense)', 'Affiliate Marketing', 'Sponsored Posts']
        : ['Display Ads (Google AdSense)', 'Affiliate Marketing'];

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
   * Value = Monthly Revenue × 24-36 months
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

    // Website value = Monthly revenue × 24-36 months
    const lowValue = lowMonthlyRevenue * 24;
    const highValue = highMonthlyRevenue * 36;

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
