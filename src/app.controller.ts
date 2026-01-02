import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHome() {
    return {
      title: 'Website Worth Calculator - Free Website Value & Traffic Estimator',
      description: 'Calculate your website\'s value, traffic, and monetization potential instantly. Free website worth calculator with detailed analysis.',
      canonicalUrl: process.env.SITE_URL,
    };
  }

  @Get('about')
  @Render('about')
  getAbout() {
    return {
      title: 'About Us - Website Worth Calculator',
      description: 'Learn more about our website valuation methodology and how we calculate website worth.',
      canonicalUrl: `${process.env.SITE_URL}/about`,
      showSearch: true,
    };
  }

  @Get('how-it-works')
  @Render('how-it-works')
  getHowItWorks() {
    return {
      title: 'How It Works - Website Worth Calculator',
      description: 'Understand how our website worth calculator estimates traffic, revenue, and website value.',
      canonicalUrl: `${process.env.SITE_URL}/how-it-works`,
      showSearch: true,
    };
  }

  @Get('privacy')
  @Render('privacy')
  getPrivacy() {
    return {
      title: 'Privacy Policy - Website Worth Calculator',
      description: 'Our privacy policy and data handling practices.',
      canonicalUrl: `${process.env.SITE_URL}/privacy`,
      showSearch: true,
    };
  }

  @Get('terms')
  @Render('terms')
  getTerms() {
    return {
      title: 'Terms of Service - Website Worth Calculator',
      description: 'Terms and conditions for using our website worth calculator.',
      canonicalUrl: `${process.env.SITE_URL}/terms`,
      showSearch: true,
    };
  }

  @Get('top-sites')
  @Render('top-sites')
  getTopSites() {
    const topSites = this.generateTopSitesData();
    return {
      title: 'Top 50 Websites by Worth - Website Rankings',
      description: 'Explore the top 50 most valuable websites ranked by estimated worth, traffic, and revenue.',
      canonicalUrl: `${process.env.SITE_URL}/top-sites`,
      showSearch: true,
      topSites,
    };
  }

  @Get('contact')
  @Render('contact')
  getContact() {
    return {
      title: 'Contact Us - Website Worth Calculator',
      description: 'Get in touch with us for questions, feedback, or support.',
      canonicalUrl: `${process.env.SITE_URL}/contact`,
      showSearch: true,
    };
  }

  private generateTopSitesData() {
    const sites = [
      { rank: 1, domain: 'google.com', category: 'Search Engine' },
      { rank: 2, domain: 'youtube.com', category: 'Video Streaming' },
      { rank: 3, domain: 'facebook.com', category: 'Social Media' },
      { rank: 4, domain: 'twitter.com', category: 'Social Media' },
      { rank: 5, domain: 'instagram.com', category: 'Social Media' },
      { rank: 6, domain: 'baidu.com', category: 'Search Engine' },
      { rank: 7, domain: 'wikipedia.org', category: 'Reference' },
      { rank: 8, domain: 'yandex.ru', category: 'Search Engine' },
      { rank: 9, domain: 'yahoo.com', category: 'Web Portal' },
      { rank: 10, domain: 'whatsapp.com', category: 'Messaging' },
      { rank: 11, domain: 'amazon.com', category: 'E-commerce' },
      { rank: 12, domain: 'tiktok.com', category: 'Social Media' },
      { rank: 13, domain: 'netflix.com', category: 'Streaming' },
      { rank: 14, domain: 'linkedin.com', category: 'Professional Network' },
      { rank: 15, domain: 'reddit.com', category: 'Forum' },
      { rank: 16, domain: 'bing.com', category: 'Search Engine' },
      { rank: 17, domain: 'microsoft.com', category: 'Technology' },
      { rank: 18, domain: 'ebay.com', category: 'E-commerce' },
      { rank: 19, domain: 'apple.com', category: 'Technology' },
      { rank: 20, domain: 'pinterest.com', category: 'Social Media' },
      { rank: 21, domain: 'twitch.tv', category: 'Live Streaming' },
      { rank: 22, domain: 'aliexpress.com', category: 'E-commerce' },
      { rank: 23, domain: 'github.com', category: 'Development' },
      { rank: 24, domain: 'walmart.com', category: 'E-commerce' },
      { rank: 25, domain: 'zoom.us', category: 'Video Conferencing' },
      { rank: 26, domain: 'discord.com', category: 'Communication' },
      { rank: 27, domain: 'espn.com', category: 'Sports' },
      { rank: 28, domain: 'cnn.com', category: 'News' },
      { rank: 29, domain: 'nytimes.com', category: 'News' },
      { rank: 30, domain: 'spotify.com', category: 'Music Streaming' },
      { rank: 31, domain: 'adobe.com', category: 'Software' },
      { rank: 32, domain: 'paypal.com', category: 'Payment' },
      { rank: 33, domain: 'imdb.com', category: 'Entertainment' },
      { rank: 34, domain: 'stackoverflow.com', category: 'Q&A' },
      { rank: 35, domain: 'wordpress.com', category: 'Blogging' },
      { rank: 36, domain: 'dropbox.com', category: 'Cloud Storage' },
      { rank: 37, domain: 'salesforce.com', category: 'CRM' },
      { rank: 38, domain: 'medium.com', category: 'Publishing' },
      { rank: 39, domain: 'shopify.com', category: 'E-commerce Platform' },
      { rank: 40, domain: 'craigslist.org', category: 'Classifieds' },
      { rank: 41, domain: 'booking.com', category: 'Travel' },
      { rank: 42, domain: 'indeed.com', category: 'Job Search' },
      { rank: 43, domain: 'tripadvisor.com', category: 'Travel' },
      { rank: 44, domain: 'etsy.com', category: 'Marketplace' },
      { rank: 45, domain: 'hulu.com', category: 'Streaming' },
      { rank: 46, domain: 'soundcloud.com', category: 'Music' },
      { rank: 47, domain: 'tumblr.com', category: 'Blogging' },
      { rank: 48, domain: 'quora.com', category: 'Q&A' },
      { rank: 49, domain: 'flickr.com', category: 'Photo Sharing' },
      { rank: 50, domain: 'vimeo.com', category: 'Video Platform' },
    ];

    // Calculate estimated worth based on rank (simplified)
    return sites.map((site) => {
      const baseValue = 100000000000; // $100B for rank 1
      const estimatedValue = Math.round(baseValue / Math.pow(site.rank, 1.5));
      const dailyVisitors = Math.round(5000000000 / Math.pow(site.rank, 1.2));

      return {
        ...site,
        estimatedValue,
        dailyVisitors,
        favicon: `https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`,
      };
    });
  }
}
