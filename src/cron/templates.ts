import { IntelligenceTemplateId } from '../types';

interface TemplateDef {
  id: IntelligenceTemplateId;
  name: string;
  description: string;
  systemPrompt: string;
}

export const RECURRING_TEMPLATES: Record<IntelligenceTemplateId, TemplateDef> = {
  STRATEGIC_PIVOT_WATCH: {
    id: "STRATEGIC_PIVOT_WATCH",
    name: "Strategic Pivot Watch",
    description: "Detects shifts in positioning or target audience.",
    systemPrompt: `
      MISSION: STRATEGIC POSITIONING ANALYSIS
      PROTOCOL:
      1. Check Homepage H1/H2 and Meta via 'web_search_exa'.
      2. Check Pricing Page for Enterprise vs PLG focus.
      3. Check Press Releases for new verticals.
      REPORT IF: Meaningful change in messaging.
    `
  },
  EXECUTIVE_EXODUS: {
    id: "EXECUTIVE_EXODUS",
    name: "Executive Exodus & Intake",
    description: "Monitors leadership changes indicating strategy shifts.",
    systemPrompt: `
      MISSION: LEADERSHIP SIGNAL INTELLIGENCE
      PROTOCOL:
      1. Scan Team/About pages via 'web_search_exa'.
      2. Search news for C-level hires/departures.
      3. Check social for VP-level announcements.
      REPORT IF: C-Level or VP-Level change detected.
    `
  },
  CHURN_SIGNAL_DETECTOR: {
    id: "CHURN_SIGNAL_DETECTOR",
    name: "Churn Signal Detector",
    description: "Scans for spikes in user anger or migration discussions.",
    systemPrompt: `
      MISSION: NEGATIVE SENTIMENT ANALYSIS
      PROTOCOL:
      1. Use 'analyze_social_sentiment' for complaints.
      2. Scan Reddit/HN for 'alternatives to' threads.
      3. Check G2/Capterra snippets.
      REPORT IF: Cluster of complaints or specific competitor switching.
    `
  },
  STEALTH_FEATURE_HUNTER: {
    id: "STEALTH_FEATURE_HUNTER",
    name: "Stealth Feature Hunter",
    description: "Watches docs and changelogs for unmarketed features.",
    systemPrompt: `
      MISSION: TECHNICAL RECONNAISSANCE
      PROTOCOL:
      1. Scan API Docs/Changelogs via 'web_search_exa'.
      2. Check developer chatter via 'analyze_social_sentiment'.
      REPORT IF: New features found in docs but not homepage.
    `
  },
  ENTERPRISE_GATEKEEPING: {
    id: "ENTERPRISE_GATEKEEPING",
    name: "Enterprise Gatekeeping",
    description: "Alerts when features move behind paywalls.",
    systemPrompt: `
      MISSION: MONETIZATION ANALYSIS
      PROTOCOL:
      1. Inspect pricing tiers via 'web_search_exa'.
      2. Check support pages for plan restrictions.
      3. Check social for SSO tax complaints.
      REPORT IF: Feature moved from Free/Pro to Enterprise.
    `
  },
  CUSTOM_DEEP_DIVE: {
    id: "CUSTOM_DEEP_DIVE",
    name: "Custom Deep Dive",
    description: "Executes specific user research question.",
    systemPrompt: `
      MISSION: CUSTOM USER DIRECTIVE
      PROTOCOL: Full autonomy to use all tools.
      REPORT IF: Specific question answered with evidence.
    `
  }
};