# Website Worth Calculator

A production-ready, SEO-optimized website worth calculator built with Node.js and NestJS. Calculate website value, traffic estimates, and monetization potential instantly.

## Features

- **Website Valuation**: Instant estimates of website market value
- **Traffic Analysis**: Monthly visitor and pageview estimates
- **Monetization Insights**: Revenue potential and best monetization strategies
- **Domain Information**: Age, HTTPS status, CMS detection, and server location
- **SEO Optimized**: Dynamic meta tags, schema markup, and clean URLs
- **Server-Side Rendering**: Fast page loads with EJS templates
- **Caching**: In-memory caching for improved performance
- **Mobile-First Design**: Clean, responsive layout
- **No User Accounts**: Completely free, no registration required
- **Ad-Ready**: Strategic ad placement sections

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Cache Manager** - In-memory caching

### Frontend
- **EJS** - Server-side templating
- **Vanilla CSS** - Mobile-first, responsive design
- **No heavy frameworks** - Fast load times

### Key Dependencies
- `@nestjs/common` - Core NestJS framework
- `@nestjs/cache-manager` - Caching functionality
- `@nestjs/config` - Environment configuration
- `axios` - HTTP client for domain checks
- `ejs` - Embedded JavaScript templates

## Project Structure

```
site-worth/
├── src/
│   ├── app.module.ts              # Main application module
│   ├── app.controller.ts          # Static pages controller
│   ├── app.service.ts             # Application service
│   ├── main.ts                    # Application entry point
│   ├── common/
│   │   └── dto/
│   │       └── domain-result.dto.ts  # Data transfer objects
│   ├── valuation/
│   │   ├── valuation.module.ts    # Valuation module
│   │   ├── valuation.controller.ts # Valuation endpoints
│   │   └── valuation.service.ts   # Valuation logic
│   ├── domain/
│   │   ├── domain.module.ts       # Domain analysis module
│   │   └── domain.service.ts      # Domain info service
│   └── seo/
│       ├── seo.module.ts          # SEO module
│       └── seo.service.ts         # SEO meta tags & schema
├── views/
│   ├── layout.ejs                 # Base layout template
│   ├── index.ejs                  # Homepage
│   ├── result.ejs                 # Results page
│   ├── about.ejs                  # About page
│   ├── how-it-works.ejs           # How it works page
│   ├── privacy.ejs                # Privacy policy
│   └── terms.ejs                  # Terms of service
├── public/
│   └── css/
│       └── main.css               # Application styles
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── nest-cli.json                  # NestJS CLI config
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd site-worth
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` to customize your configuration:
```env
NODE_ENV=development
PORT=3000
SITE_URL=http://localhost:3000
SITE_NAME=Website Worth Calculator
CACHE_TTL=3600
```

4. **Start the development server**
```bash
npm run start:dev
```

5. **Open your browser**
```
http://localhost:3000
```

## Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugging enabled
- `npm run build` - Build for production
- `npm run start:prod` - Start production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Usage

### Calculate Website Worth

1. Visit the homepage
2. Enter a domain name (e.g., `example.com`)
3. Click "Calculate Worth"
4. View comprehensive analysis including:
   - Estimated website value
   - Traffic overview
   - Monetization potential
   - Domain and technical information
   - Final verdict

### API Endpoints

- `GET /` - Homepage
- `GET /website-worth/:domain` - Calculate website worth
- `GET /about` - About page
- `GET /how-it-works` - How it works page
- `GET /privacy` - Privacy policy
- `GET /terms` - Terms of service

## Estimation Methodology

### Traffic Estimation
Based on:
- Domain extension (.com, .net, .org, etc.)
- Domain age
- HTTPS status
- Technical factors

### Revenue Calculation
- Uses industry-standard RPM (Revenue Per Mille)
- RPM ranges from $1-$15 per 1,000 pageviews
- Monthly Revenue = (Pageviews / 1,000) × RPM

### Website Value
- Formula: Monthly Revenue × 24-36 months
- Industry standard valuation multiple
- Shown as ranges to reflect variability

### Monetization Assessment
- **Low**: < 20,000 monthly visitors
- **Medium**: 20,000-100,000 monthly visitors
- **High**: > 100,000 monthly visitors

## SEO Features

- Dynamic meta titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Schema.org structured data
- Clean, indexable URLs
- Fast server response times
- Mobile-first responsive design

## Caching Strategy

- In-memory caching with configurable TTL
- Default cache duration: 1 hour (3600 seconds)
- Cached data:
  - Domain analysis results
  - Valuation calculations
- Cache key format: `valuation:{domain}`

## Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start:prod
```

### Environment Configuration
Set these environment variables for production:
```env
NODE_ENV=production
PORT=3000
SITE_URL=https://yourdomain.com
SITE_NAME=Website Worth Calculator
CACHE_TTL=3600
```

### Deployment Platforms

#### Vercel / Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set start command: `npm run start:prod`
4. Configure environment variables

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

#### Traditional VPS
1. Install Node.js 18+
2. Clone repository
3. Install dependencies: `npm ci --only=production`
4. Build: `npm run build`
5. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/main.js --name "website-worth"
pm2 startup
pm2 save
```

## Performance Optimization

- Server-side rendering for fast initial load
- In-memory caching to reduce computation
- Minimal CSS (no frameworks)
- No client-side JavaScript frameworks
- Optimized for Core Web Vitals

## Customization

### Modify Valuation Logic
Edit `src/valuation/valuation.service.ts`:
- Adjust traffic estimation factors
- Modify RPM ranges
- Change valuation multiples

### Update Styling
Edit `public/css/main.css`:
- Change color scheme in CSS variables
- Adjust layout and spacing
- Customize components

### Add New Pages
1. Create controller method in `src/app.controller.ts`
2. Create EJS template in `views/`
3. Add navigation links in `views/layout.ejs`

## Advertising Integration

Ad placeholders are strategically placed:
1. After website value estimate
2. Mid-page after traffic section
3. Footer area

To integrate ads, replace the `.ad-placeholder` sections in templates with your ad code (Google AdSense, etc.).

## Important Notes

### Disclaimers
All valuations are estimates and should not be considered:
- Professional appraisals
- Financial advice
- Guaranteed valuations
- Binding offers

### Accuracy
Estimates are based on general industry metrics. Actual values may vary based on:
- Content quality and niche
- Actual traffic and engagement
- Revenue history
- Market conditions
- Brand value

## Support & Contributing

For issues or questions, please open a GitHub issue.

## License

MIT License - feel free to use this project for any purpose.

## Credits

Built with:
- [NestJS](https://nestjs.com/)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [EJS](https://ejs.co/)

---

**Website Worth Calculator** - Free, Fast, and SEO-Optimized 🚀
