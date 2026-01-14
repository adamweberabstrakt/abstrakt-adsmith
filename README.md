# AdSmith - Brand Lift Radar

AI-powered B2B marketing strategy tool that analyzes brand maturity and provides personalized paid media recommendations.

## Features

- **3-Step Assessment Form**: Business context, marketing state, brand maturity
- **AI-Powered Analysis**: Claude generates brand gap analysis and recommendations
- **Budget Recommendations**: Conservative ($1,000-$2,500) and Aggressive (up to $5,000+) options
- **Ad Angle Generator**: 3 tailored messaging angles per assessment
- **Image Generation**: DALL-E 3, Flux Schnell, Google Imagen 3 via Replicate
- **Ideogram Integration**: External link for text-driven designs
- **Competitor Ads Transparency**: Links to Google Ads Transparency Center
- **PDF Download**: Export analysis results
- **UTM/GCLID Tracking**: Full attribution capture
- **Zapier Integration**: Webhook for lead data

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Claude API (Anthropic)
- Replicate API (Image Generation)

## Setup

1. Clone and install:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your API keys:
```
ANTHROPIC_API_KEY=your_key
REPLICATE_API_TOKEN=your_token
```

3. Run development server:
```bash
npm run dev
```

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## Branding

- **App Name**: AdSmith
- **Tagline**: Brand Lift Radar
- **Colors**: Mid-gray background (#3d3d3d), Abstrakt orange accents (#e85d04)
- **Font**: Oswald (headings), Inter (body)
