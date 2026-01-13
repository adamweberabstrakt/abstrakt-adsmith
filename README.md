# Abstrakt Brand Lift Simulator

**AI Search Visibility & Media Planning Tool**  
Built by Abstrakt Marketing Group

---

## 🎯 Overview

The Brand Lift Simulator is a lead magnet tool that helps B2B CEOs, founders, and marketing leaders understand how branded paid media drives AI Search visibility. It reframes SEO outcomes in the AI Search era and outputs actionable paid media plans.

### Key Features

1. **Input Layer** - 8-12 questions covering business context, marketing state, and brand maturity
2. **AI Analysis Engine** - Claude-powered brand tier classification and gap analysis
3. **Media Budget Recommendation** - Tailored budget allocations with conservative/aggressive options
4. **Messaging & Creative Direction** - 3-5 brand-first ad angles with headlines and CTAs
5. **Ad Creative Generator** - NEW! Generate ad images with DALL-E/Flux + Pomelli integration
6. **Conversion Layer** - Email capture + PDF report delivery

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key
- Resend API key (for email)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/abstrakt-brand-lift-simulator.git
cd abstrakt-brand-lift-simulator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# ANTHROPIC_API_KEY=your_key
# RESEND_API_KEY=your_key
# INTERNAL_EMAIL=your_email

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```
brand-lift-simulator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts       # Claude analysis endpoint
│   │   │   ├── generate-image/route.ts # AI image generation (DALL-E/Flux)
│   │   │   └── generate-pdf/route.ts   # PDF + email delivery
│   │   ├── globals.css                 # Tailwind + custom styles
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Main app component
│   ├── components/
│   │   ├── Logo.tsx                    # Brand header
│   │   ├── ProgressIndicator.tsx       # Step progress
│   │   ├── BusinessContextForm.tsx     # Step 1 form
│   │   ├── MarketingStateForm.tsx      # Step 2 form
│   │   ├── BrandMaturityForm.tsx       # Step 3 form
│   │   ├── LeadCaptureForm.tsx         # Email capture
│   │   ├── ResultsDisplay.tsx          # Analysis results + tabs
│   │   └── AdCreativeGenerator.tsx     # Pomelli + AI image generation
│   └── lib/
│       ├── types.ts                    # TypeScript interfaces
│       └── prompts.ts                  # Claude prompt templates
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key from console.anthropic.com |
| `RESEND_API_KEY` | Yes | Email delivery API key from resend.com |
| `INTERNAL_EMAIL` | No | Email for lead notifications (default: leads@abstraktmg.com) |
| `OPENAI_API_KEY` | No* | OpenAI key for DALL-E 3 image generation |
| `REPLICATE_API_TOKEN` | No* | Replicate token for Flux image generation |

*At least one image generation API key is recommended for the Ad Creative Generator feature.

### Vercel Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

---

## 🎨 Design System

The app follows the Abstrakt brand guidelines:

| Token | Value | Usage |
|-------|-------|-------|
| `abstrakt-bg` | #0a0a0a | Page background |
| `abstrakt-card` | #141414 | Card backgrounds |
| `abstrakt-orange` | #e85d04 | Primary accent |
| `abstrakt-text` | #ffffff | Primary text |
| `abstrakt-text-muted` | #9a9a9a | Secondary text |

Typography:
- Headings: Oswald (bold, uppercase)
- Body: Inter (regular)

---

## 📊 API Endpoints

### POST /api/analyze

Analyzes form data and returns brand assessment + recommendations.

**Request Body:**
```json
{
  "businessContext": {
    "companyName": "string",
    "industry": "string",
    "averageDealSize": number | null,
    "salesCycleLength": "string",
    "geographicFocus": "local" | "regional" | "national" | "international"
  },
  "marketingState": {
    "monthlySeoBudget": number | null,
    "monthlyPaidMediaBudget": number | null,
    "primaryGoal": "leads" | "pipeline" | "brand" | "all",
    "declineExperienced": "traffic" | "leads" | "both" | "none"
  },
  "brandMaturity": {
    "brandRecognition": "low" | "moderate" | "strong",
    "existingBrandedSearch": "yes" | "no" | "unknown",
    "competitorAwareness": "low" | "moderate" | "high"
  }
}
```

### POST /api/generate-pdf

Generates and emails the PDF report.

**Request Body:**
```json
{
  "formData": { /* same as analyze */ },
  "analysis": { /* analysis result */ },
  "leadData": {
    "email": "string",
    "companySize": "string",
    "role": "string",
    "wantsCall": boolean
  }
}
```

### POST /api/generate-image

Generates ad background images using AI (DALL-E 3 or Flux).

**Request Body:**
```json
{
  "formData": { /* same as analyze */ },
  "analysis": { /* analysis result */ },
  "adAngle": {
    "type": "problem-aware",
    "headline": "string",
    "subheadline": "string",
    "valueProposition": "string",
    "ctaText": "string",
    "targetFunnelStage": "awareness"
  },
  "style": "professional" | "bold" | "minimal" | "tech"
}
```

**Response:**
```json
{
  "imageUrl": "https://...",
  "provider": "dall-e-3" | "flux",
  "revisedPrompt": "..." // DALL-E only
}
```

---

## 🎨 Ad Creative Generator

The app includes two methods for generating ad creatives:

### 1. Google Pomelli Integration
- Generates a formatted prompt based on your selected ad angle
- Copy the prompt and paste into [Pomelli](https://labs.google/fx/tools/pomelli)
- Pomelli creates complete ad mockups with text, images, and layouts

### 2. AI Image Generation
- Generates professional background images using DALL-E 3 or Flux
- Choose from 4 style presets:
  - **Professional**: Clean, corporate, trustworthy
  - **Bold**: Vibrant, energetic, startup aesthetic
  - **Minimal**: Elegant, refined, Apple-like
  - **Tech**: Dark mode, futuristic, innovative
- Images are text-free, designed for overlay with your ad copy
- Download generated images or open full-size

---

## 🔮 Future Enhancements (Phase 2+)

- [ ] Google AI Max API integration (when available)
- [ ] Semrush API for competitive keyword data
- [ ] Historical tracking / dashboard for returning users
- [ ] A/B testing for landing page variants
- [ ] CRM integration (HubSpot, Salesforce)
- [ ] Batch image generation
- [ ] Ad mockup templates with copy overlay

---

## 📝 License

© 2024 Abstrakt Marketing Group. All rights reserved.

---

**Built with ❤️ by the Abstrakt team**
