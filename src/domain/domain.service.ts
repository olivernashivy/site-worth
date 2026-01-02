import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface DomainInfoResult {
  age?: string;
  httpsEnabled?: boolean;
  serverLocation?: string;
  cms?: string;
}

@Injectable()
export class DomainService {
  /**
   * Get comprehensive domain information
   */
  async getDomainInfo(domain: string): Promise<DomainInfoResult> {
    const result: DomainInfoResult = {};

    try {
      // Check HTTPS availability
      result.httpsEnabled = await this.checkHttps(domain);

      // Detect CMS
      result.cms = await this.detectCms(domain);

      // Estimate domain age (simplified - would use WHOIS in production)
      result.age = this.estimateDomainAge(domain);

      // Get server location (simplified)
      result.serverLocation = 'United States'; // Default for demo
    } catch (error) {
      // Return partial results if some checks fail
      console.error('Error getting domain info:', error.message);
    }

    return result;
  }

  /**
   * Check if domain supports HTTPS
   */
  private async checkHttps(domain: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://${domain}`, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true, // Accept any status code
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Detect CMS by checking common patterns
   */
  private async detectCms(domain: string): Promise<string | undefined> {
    try {
      const protocol = await this.checkHttps(domain) ? 'https' : 'http';
      const response = await axios.get(`${protocol}://${domain}`, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true,
      });

      const html = response.data.toString().toLowerCase();
      const headers = response.headers;

      // Check for WordPress
      if (
        html.includes('wp-content') ||
        html.includes('wp-includes') ||
        html.includes('wordpress')
      ) {
        return 'WordPress';
      }

      // Check for Shopify
      if (html.includes('shopify') || headers['x-shopify-stage']) {
        return 'Shopify';
      }

      // Check for Wix
      if (html.includes('wix.com') || html.includes('wixsite')) {
        return 'Wix';
      }

      // Check for Joomla
      if (html.includes('joomla')) {
        return 'Joomla';
      }

      // Check for Drupal
      if (html.includes('drupal')) {
        return 'Drupal';
      }

      // Check for Squarespace
      if (html.includes('squarespace')) {
        return 'Squarespace';
      }

      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Estimate domain age based on TLD and other factors
   * In production, this would use actual WHOIS data
   */
  private estimateDomainAge(domain: string): string {
    const tld = domain.split('.').pop();

    // Simple heuristic for demo purposes
    // In production, you would use a WHOIS lookup service
    if (tld === 'com' || tld === 'net' || tld === 'org') {
      return '5 years';
    } else if (tld === 'io' || tld === 'co') {
      return '2 years';
    } else {
      return '1 year';
    }
  }

  /**
   * Validate domain format
   */
  validateDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  }
}
