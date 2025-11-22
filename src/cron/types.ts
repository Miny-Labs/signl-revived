export type Frequency = "DAILY_MORNING" | "WEEKLY_MONDAY" | "WEEKLY_FRIDAY" | "MONTHLY_1ST";

export type IntelligenceTemplateId = 
  | "STRATEGIC_PIVOT_WATCH" 
  | "EXECUTIVE_EXODUS" 
  | "CHURN_SIGNAL_DETECTOR" 
  | "STEALTH_FEATURE_HUNTER" 
  | "ENTERPRISE_GATEKEEPING"
  | "CUSTOM_DEEP_DIVE";

export interface RecurringJob {
  id: string;
  userId: string;
  userEmail: string;
  
  templateId: IntelligenceTemplateId;
  targetName: string;
  targetUrl: string;
  customQuery?: string;
  
  frequency: Frequency;
  lastRunAt: string | null;
  nextRunAt: string;
  isActive: boolean;
  
  lastResultHash?: string; 
}