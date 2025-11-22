import 'dotenv/config';
import { executeWarRoom } from './agents';
import { WarRoomMissionContext } from './types';

// --- TEST PAYLOAD ---
const TEST_CONTEXT: WarRoomMissionContext = {
  identity: {
    fullName: "Akash Test",
    email: "thatspacebiker@gmail.com", // <--- Your Target Email
    role: "Founder"
  },
  company: {
    name: "VectorVault",
    websiteDomain: "https://vectorvault.io",
    foundingYear: 2024,
    headquartersLocation: "San Francisco",
    employeeCountRange: "1-10",
    primaryIndustry: "Database",
    businessModel: "Open Source Core",
    currentFundingStage: "Seed"
  },
  strategy: {
    coreValueProposition: "Local-first Vector DB for Privacy",
    problemBeingSolved: "Cloud data leakage",
    idealCustomerProfile: "Healthcare Startups",
    northStarMetric: "Local Installs",
    pricingStrategy: "Enterprise License (Contact Sales)",
    primaryGtmMotion: "Product Led Growth (Self Serve)",
    targetGeography: ["North America"],
    positioning: "Privacy / Security First",
    unfairAdvantage: "Deep Tech / R&D"
  },
  product: {
    primaryFeatureSet: ["Local Embedding", "Encryption"],
    complianceRequirements: ["HIPAA"],
    integrationsList: ["LangChain"],
    deploymentMethod: "On-Prem",
    mobileAppAvailable: false,
    apiFirst: true
  },
  anxiety: {
    biggestFear: "Pinecone launches on-prem container",
    whatKeepsYouUpAtNight: "Commoditization",
    knownWeaknessInternal: "Speed",
    topReasonForChurn: "Performance",
    topReasonForLossInSales: "Brand"
  },
  targets: {
    competitorNames: ["Pinecone"], // We focus on one for the test
    specificRumorsToVerify: ["Are they lowering prices?", "Any new on-prem rumors?"],
    perceivedThreatLevel: "Existential (Kill or be Killed)",
    specificQuestionsForAgent: [],
    blacklistedDomains: []
  },
  outputPreferences: {
    reportTone: "Ruthless VC (Critique)",
    includeRawSources: true,
    focusAreas: ["Pricing", "Product", "Sentiment"],
    language: "English"
  }
};

// --- RUNNER ---
async function runTest() {
  console.log("🧪 STARTING DIRECT TEST...");
  try {
    await executeWarRoom("TEST-RUN-001", TEST_CONTEXT);
    console.log("🧪 TEST COMPLETE.");
  } catch (e) {
    console.error("🧪 TEST FAILED:", e);
  }
}

runTest();