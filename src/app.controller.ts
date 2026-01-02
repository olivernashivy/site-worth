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
    };
  }

  @Get('how-it-works')
  @Render('how-it-works')
  getHowItWorks() {
    return {
      title: 'How It Works - Website Worth Calculator',
      description: 'Understand how our website worth calculator estimates traffic, revenue, and website value.',
      canonicalUrl: `${process.env.SITE_URL}/how-it-works`,
    };
  }

  @Get('privacy')
  @Render('privacy')
  getPrivacy() {
    return {
      title: 'Privacy Policy - Website Worth Calculator',
      description: 'Our privacy policy and data handling practices.',
      canonicalUrl: `${process.env.SITE_URL}/privacy`,
    };
  }

  @Get('terms')
  @Render('terms')
  getTerms() {
    return {
      title: 'Terms of Service - Website Worth Calculator',
      description: 'Terms and conditions for using our website worth calculator.',
      canonicalUrl: `${process.env.SITE_URL}/terms`,
    };
  }
}
