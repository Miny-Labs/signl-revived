# 🎯 Signl

> **Your AI War Room for Competitive Intelligence**
>  Stop being blindsided by competitors. Get brutal, automated intel reports delivered to your inbox.

Built for the [E2B MCP Agents Hackathon](https://lu.ma/mcp-agents) with Docker MCP Hub, Groq, and E2B Sandboxes.


WEBSITE - https://signl.lovable.app
------

## 🤔 The Problem

You're building a startup. You know your competitors exist. But by the time you hear about their:

- Pricing changes
- New enterprise features
- Executive departures
- Funding rounds
- Customer churn signals

...it's already on TechCrunch. **Too late.**

Most founders check competitors manually once a month (if that). Signl does it for you, autonomously, with the ruthlessness of a VC in due diligence mode.

------

## ⚡ What Signl Does

Signl is an **agentic competitive intelligence system** that:

1. **Researches your competitors** using real-time web search (Exa), deep reasoning (Perplexity), and social sentiment analysis (xAI Grok)
2. **Synthesizes findings** into executive-ready intelligence reports
3. **Delivers via email** automatically, with zero human intervention
4. **Runs on a schedule** (daily, weekly, monthly) for continuous monitoring

Think of it as having a junior analyst working 24/7, except they never sleep, never complain, and cost $0.15 per report.

------

## 🏗️ Architecture

Signl uses the **E2B + MCP architecture** to create truly autonomous agents:

<img width="1024" height="572" alt="image" src="https://github.com/user-attachments/assets/39201b35-5bf7-4406-853c-d731a714cc83" />


### Why This Matters (Hackathon Context)

- **E2B Sandboxes**: Each mission runs in an isolated cloud environment with MCP servers pre-configured
- **Docker MCP Hub**: We use 3 MCPs from the hub (Exa, Perplexity, Resend) – no manual setup
- **Groq**: Lightning-fast LLM inference (GPT OSS 120B) for real-time reasoning
- **Tool-calling loops**: The agent decides autonomously which tools to use and when

------

## 🎬 Demo: Trigger a Mission

1. Start the server:

```bash
npm start
```

2. Open a new terminal and run this CURL command to trigger a **5-minute test mission**:

```bash
curl -X POST http://localhost:4000/api/signl/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "duration": 5,
    "identity": {
      "fullName": "Your Name",
      "email": "you@company.com",
      "role": "Founder"
    },
    "company": {
      "name": "YourStartup",
      "websiteDomain": "https://yourstartup.com",
      "foundingYear": 2024,
      "headquartersLocation": "San Francisco",
      "employeeCountRange": "1-10",
      "primaryIndustry": "SaaS",
      "businessModel": "B2B SaaS",
      "currentFundingStage": "Seed"
    },
    "strategy": {
      "coreValueProposition": "The fastest vector database",
      "problemBeingSolved": "Slow similarity search",
      "idealCustomerProfile": "ML Engineers",
      "northStarMetric": "Query Latency",
      "pricingStrategy": "Usage Based (Pay As You Go)",
      "primaryGtmMotion": "Product Led Growth (Self Serve)",
      "targetGeography": ["North America"],
      "positioning": "Speed / Performance King",
      "unfairAdvantage": "Proprietary IP / Patent"
    },
    "product": {
      "primaryFeatureSet": ["Real-time indexing", "Sub-millisecond search"],
      "complianceRequirements": ["SOC2"],
      "integrationsList": ["OpenAI", "LangChain"],
      "deploymentMethod": "Cloud",
      "mobileAppAvailable": false,
      "apiFirst": true
    },
    "anxiety": {
      "biggestFear": "Competitor launches free tier",
      "whatKeepsYouUpAtNight": "Commoditization",
      "knownWeaknessInternal": "Enterprise sales process",
      "topReasonForChurn": "Price",
      "topReasonForLossInSales": "Brand recognition"
    },
    "targets": {
      "competitorNames": ["Pinecone", "Weaviate"],
      "specificRumorsToVerify": ["Any new funding rounds?"],
      "perceivedThreatLevel": "Existential (Kill or be Killed)",
      "specificQuestionsForAgent": [],
      "blacklistedDomains": []
    },
    "outputPreferences": {
      "reportTone": "Ruthless VC (Critique)",
      "includeRawSources": true,
      "focusAreas": ["Pricing", "Product", "Sentiment"],
      "language": "English"
    }
  }'
```


**What happens:**

1. Agent spins up an E2B sandbox with MCP servers
2. Searches the web for competitor intel (Exa)
3. Reasons about findings (Perplexity)
4. Scrapes social sentiment (xAI Grok)
5. Synthesizes a brutally honest report
6. Sends it to your email (Resend)

**Time to completion:** ~45 seconds
 **Cost:** ~$0.15 (Groq + E2B + APIs)

------

## 🔁 Recurring Intelligence Jobs

Set up scheduled monitoring:

```bash
curl -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -H "X-User-ID: founder_123" \
  -d '{
    "templateId": "STRATEGIC_PIVOT_WATCH",
    "targetName": "Pinecone",
    "targetUrl": "https://pinecone.io",
    "userEmail": "you@company.com",
    "frequency": "WEEKLY_MONDAY"
  }'
```

### Available Templates

| Template ID              | What It Watches                          | Example Use Case             |
| ------------------------ | ---------------------------------------- | ---------------------------- |
| `STRATEGIC_PIVOT_WATCH`  | Homepage messaging, positioning shifts   | "Did they change their ICP?" |
| `EXECUTIVE_EXODUS`       | C-level hires/departures                 | "New CTO from Google?"       |
| `CHURN_SIGNAL_DETECTOR`  | Social complaints, migration threads     | "Are users angry?"           |
| `STEALTH_FEATURE_HUNTER` | Docs/changelogs for unannounced features | "Secret enterprise plan?"    |
| `ENTERPRISE_GATEKEEPING` | Features moving behind paywalls          | "Did they SSO-tax us?"       |
| `CUSTOM_DEEP_DIVE`       | Your specific research question          | "What's their GPU strategy?" |

Jobs run autonomously via `node-cron` and store state in SQLite.

------

## 🚀 Setup

### Prerequisites

- Node.js 18+
- [E2B API Key](https://e2b.dev) (free $100 credits)
- [Groq API Key](https://groq.com) (use promo code `MCP_AGENTS_2025` for $10)
- [Exa API Key](https://exa.ai)
- [Perplexity API Key](https://perplexity.ai)
- [Resend API Key](https://resend.com)
- [xAI API Key](https://x.ai) (optional, for social sentiment)

### Installation

```bash
# Clone
git clone <your-repo>
cd miny-labs-signl-revived

# Install
npm install

# Configure
cp .env.example .env
# Add your API keys to .env

# Build E2B template (one-time)
npm run build

# Start server
npm run start
```

### `.env` File

```bash
E2B_API_KEY=your_e2b_key
GROQ_API_KEY=your_groq_key
EXA_API_KEY=your_exa_key
PERPLEXITY_API_KEY=your_perplexity_key
RESEND_API_KEY=your_resend_key
SENDER_EMAIL=your@domain.com
XAI_API_KEY=your_xai_key  # optional
```

------

## 🧪 Testing

### Test Email System

```bash
npx tsx src/test-email.ts
```

Verifies that Resend MCP is working.

### Test Full Mission

```bash
npx tsx src/test.ts
```

Runs a complete war room mission with a test payload.

------

## 📁 Project Structure

```
src/
├── server.ts          # Hono API server
├── agents.ts          # Core agentic execution loop
├── mandate.ts         # System prompt generator
├── types.ts           # TypeScript interfaces
├── template.ts        # E2B template definition
└── cron/
    ├── scheduler.ts   # Background job runner
    ├── storage.ts     # SQLite job persistence
    └── templates.ts   # Recurring intel templates
```

------

## 🎯 Hackathon Requirements Checklist

- ✅ Uses **E2B Sandbox** for isolated execution
- ✅ Uses **3 MCPs from Docker Hub** (Exa, Perplexity, Resend)
- ✅ Uses **Groq** for LLM inference
- ✅ Demonstrates **autonomous tool-calling loops**
- ✅ Solves a **real founder problem** (competitive intel)
- ✅ **Functioning demo** (test.ts works end-to-end)
- ✅ **Scalable architecture** (supports recurring jobs)

------

## 🏆 Killer Features

1. **Real Business Value**: Every founder needs this. Competitive intel is manual, expensive, and slow.
2. **True Autonomy**: The agent decides which tools to use and when. No hardcoded workflows.
3. **Production-Ready**: SQLite persistence, cron scheduling, email delivery. Not a toy.
4. **Leverages MCP Properly**: Each MCP (Exa, Perplexity, Resend) serves a distinct purpose in the intelligence pipeline.
5. **Scalable**: Can monitor 100 competitors for 100 founders with the same infra.

------

## 🐛 Known Issues & TODOs

- [ ] Add deduplication (don't send same report twice)
- [ ] Implement web UI for job management
- [ ] Add Slack/Discord delivery options
- [ ] Support multi-competitor analysis in one mission
- [ ] Add cost tracking per job
- [ ] Implement result hashing to detect "nothing new"

------

## 🤝 Contributing

This was built in 48 hours for a hackathon. If you want to extend it:

1. Fork it
2. Add your feature
3. Submit a PR

Ideas for extensions:

- Add more MCP servers (GitHub for commits, Browserbase for screenshots)
- Build a Chrome extension for on-demand competitor checks
- Add sentiment analysis for customer reviews (G2, Capterra)
- Integrate with CRM (Hubspot, Salesforce)

------

## 📜 License

MIT – do whatever you want with it.

------

## 🙏 Acknowledgments

Built with:

- [E2B](https://e2b.dev) – Cloud runtime for AI agents
- [Groq](https://groq.com) – Blazing fast LLM inference
- [Docker MCP Hub](https://github.com/modelcontextprotocol) – Prebuilt tool servers
- [Exa](https://exa.ai) – Neural web search
- [Perplexity](https://perplexity.ai) – AI reasoning engine
- [Resend](https://resend.com) – Email for developers
- [xAI Grok](https://x.ai) – Real-time social intelligence

------

**Built by a founder, for founders who are tired of being caught off guard.**

If this saved you from a competitor blindside, star the repo ⭐
