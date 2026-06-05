export interface AITool {
  id: string;
  name: string;
  category: 'Agents' | 'Workflow' | 'Data & Analytics' | 'Customer Experience' | 'Content & Design';
  description: string;
  benefit: string;
  complexity: 'Low' | 'Medium' | 'High';
  estimatedEffort: string;
  roiEstimate: string;
  recommendedFor: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  techStack: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  companyName: string;
  websiteScope: 'brand_site' | 'lead_gen' | 'both_connected' | 'not_sure';
  interestArea: 'consulting' | 'automation' | 'full_setup' | 'other';
  message: string;
  submittedAt: string;
}

export interface BrandAsset {
  id: string;
  title: string;
  domain: string;
  role: string;
  description: string;
  targetAudience: string;
  keyPages: string[];
  conversionGoal: string;
  colorScheme: {
    primary: string;
    secondary: string;
    bgText: string;
  };
}

export interface SlackNotification {
  id: string;
  timestamp: string;
  channel: string;
  status: 'success' | 'simulate_only' | 'error';
  type: 'lead_form' | 'contact_form' | 'newsletter' | 'system';
  payload: Record<string, any>;
}
