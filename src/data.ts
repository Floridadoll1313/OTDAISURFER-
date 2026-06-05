import { AITool, PortfolioProject, BlogPost, BrandAsset } from './types';

export const BRAND_ASSETS: BrandAsset[] = [
  {
    id: 'primary',
    title: 'OTDAISurfer.surf',
    domain: 'OTDAISurfer.surf',
    role: 'Primary Brand Flagship Presence',
    description: 'The high-end corporate flagship representing the core consultancy credentials, client portfolio, intellectual property, and high-tier engineering services.',
    targetAudience: 'Enterprise clients, tech leaders, Venture Capital firms, and legacy businesses seeking massive operations-level AI transformations.',
    keyPages: ['Flagship Homepage', 'AI Engineering Services Matrix', 'Client Case-Studies (Portfolio)', 'Unified Contact & RFPs Hub'],
    conversionGoal: 'Enterprise contract consultation scheduling, long-term retainers, and tech partners onboarding.',
    colorScheme: {
      primary: 'Ocean Deep Obsidian',
      secondary: 'Foam & Teal Glow',
      bgText: 'Dark theme: Luxury high-contrast marine canvas'
    }
  },
  {
    id: 'secondary',
    title: 'OceanTideDropAISurfer.services',
    domain: 'OceanTideDropAISurfer.services',
    role: 'Educational & Lead Acquisition Engine',
    description: 'The energetic focus-landing property designed specifically to answer immediate tactical questions, host dynamic campaign lead magnets, and guide potential clients to the right tools.',
    targetAudience: 'Small-to-medium businesses (SMBs), product managers, and operations leads searching for approachable entryways into AI.',
    keyPages: ['Interactive Tool Selector', 'Tactical AI Audits', 'Educational Blog (Waves of AI)', 'Lead Capture campaign widgets'],
    conversionGoal: 'Subscribing to tactical AI audit services, newsletter growth, interactive tool usage leads, and entry-level packages booking.',
    colorScheme: {
      primary: 'Energetic Cyan & Tidal Teal',
      secondary: 'Sunset Amber Accents',
      bgText: 'Clean High-contrast Canvas: approachable yet highly scientific'
    }
  }
];

export const AI_TOOLS: AITool[] = [
  {
    id: 'tool-autonomous-agent',
    name: 'TidalAgent Task Orchestrator',
    category: 'Agents',
    description: 'Autonomous AI staff designed to manage customer bookings, synchronize multi-system data, and automatically alert operators of system deviances.',
    benefit: 'Saves 20+ staff hours/week by automating level-1 cognitive tasks.',
    complexity: 'High',
    estimatedEffort: '3 - 5 weeks integration',
    roiEstimate: 'Up to 340% YoY ROI',
    recommendedFor: ['Operations', 'Customer Support', 'E-commerce logistics']
  },
  {
    id: 'tool-smart-rag',
    name: 'ReefSense RAG Document Pilot',
    category: 'Data & Analytics',
    description: 'A deep-knowledge retrieval system connected to internal manuals, past sales logs, and customer sheets. Instantly indexes and answers natural questions without hallucinating.',
    benefit: 'Bridges knowledge gaps for customer service reps instantly.',
    complexity: 'Medium',
    estimatedEffort: '2 weeks deploy',
    roiEstimate: '210% efficiency gain',
    recommendedFor: ['Legal departments', 'Medical labs', 'Technical compliance']
  },
  {
    id: 'tool-workflow-automate',
    name: 'DropWave Webhook Router',
    category: 'Workflow',
    description: 'Flawless background integration pipelines connecting Airtable, Slack, Gmail, Hubspot, and Stripe. No-code logic triggers with LLM processing at critical decision junctures.',
    benefit: 'Eliminates repetitive data entry and manual copy-pasting entirely.',
    complexity: 'Low',
    estimatedEffort: '1 week setup',
    roiEstimate: 'Immediate overhead reduction',
    recommendedFor: ['Marketing agencies', 'SaaS vendors', 'Real estate managers']
  },
  {
    id: 'tool-sentiment-responder',
    name: 'SwellRespond Review Pilot',
    category: 'Customer Experience',
    description: 'Polite, brand-customized reply generation system that reviews incoming reviews, analyzes customer emotion, suggests CRM tags, and drafts personal responses.',
    benefit: 'Ensures 100% review-rate replies, driving high Google Maps rankings.',
    complexity: 'Low',
    estimatedEffort: '3 days integration',
    roiEstimate: '40% brand loyalty boost',
    recommendedFor: ['Local businesses', 'Hotels & Hospitality', 'Retail brands']
  },
  {
    id: 'tool-seo-generator',
    name: 'SurfDraft SEO Content Engine',
    category: 'Content & Design',
    description: 'An structured AI draft writer that generates rich blog structures based on the latest trending keywords, and formats code with semantic HTML structured schemas.',
    benefit: 'Pumps out high-relevance rough drafts matching domain-level vocabulary.',
    complexity: 'Medium',
    estimatedEffort: '1 - 2 weeks setup',
    roiEstimate: '80% content-generation cost savings',
    recommendedFor: ['Marketing agencies', 'E-commerce sellers', 'Blog publishers']
  },
  {
    id: 'tool-auto-transcription',
    name: 'BreakerAudio Meeting Summarizer',
    category: 'Workflow',
    description: 'Listens to client discovery zoom-calls, transcribes technical specifications, lists concrete checklists, and populates team Slack project boards automatically.',
    benefit: 'Guarantees meeting agendas never slip through team cracks.',
    complexity: 'Low',
    estimatedEffort: '2 days config',
    roiEstimate: '110% alignment safety',
    recommendedFor: ['Consultants', 'Remote tech product teams', 'Law offices']
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-ocean-cargo',
    title: 'Autonomous Tidal Cargo Routing Engine',
    category: 'AI Logistics Logistics AI',
    description: 'Developed an enterprise-level maritime vessel traffic planner using neural systems to schedule paths based on wave dynamics, fuel indexes, and harbour tides.',
    challenge: 'High cost of container ship waiting-lines at heavy ports due to uncoordinated tides.',
    solution: 'Designed and integrated TideAgent, a planning agent feeding on Google Cloud Data, forecasting container queues and optimizing vessel speeds.',
    impact: '$3.4M saved in diesel costs, 12% drop in global port waiting times.',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'Google BigQuery', 'Skyline API']
  },
  {
    id: 'proj-legal-shores',
    title: 'Deep RAG Compliance Officer for Coastal Finance',
    category: 'FinTech Regulations Regulatory AI',
    description: 'Built an enterprise secure database browser indexing 30,000+ legislative documents to assist compliance officers auditing multi-ocean investments.',
    challenge: 'Human underwriters took an average of 4.5 days to vet environmental beach credits.',
    solution: 'Engineered a highly deterministic retriever utilizing hybrid search (BM25 + vector embeddings) to locate legislative limits with absolute accuracy.',
    impact: 'Audit time plummeting from 4.5 days to 8 minutes, with 0% historical breach errors.',
    techStack: ['TypeScript', 'Pinecone', 'Vertex AI', 'Next.js', 'PostgreSQL']
  },
  {
    id: 'proj-retail-swell',
    title: 'Dynamic Surge & Trend Predictor for WaveWear',
    category: 'Predictive Intelligence Forecasting',
    description: 'Implemented a localized stock predictor connecting seasonal ocean weather metrics, apparel trends, and social sentiment indexes.',
    challenge: 'Overstocking of high-cost items during unseasonable colder winters in beach locations.',
    solution: 'Built an analytical forecast model analyzing regional satellite temperatures to advise retail inventory dispatchers.',
    impact: '32% inventory storage cost reduction and 18% sales growth.',
    techStack: ['Python', 'PyTorch', 'scikit-learn', 'Tailwind CSS', 'Redshift']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-surf-wave-choice',
    title: 'Riding the Right Waves: How to Avoid Over-Engineering Your AI Pipeline',
    category: 'AI Architecture Strategy',
    excerpt: 'Not every operations issue needs a heavy multi-agent swarm. Learn why choosing standard API triggers and simple prompt structuring wins 9 times out of 10.',
    readTime: '5 min read',
    date: 'May 28, 2026',
    content: 'The primary trap for modern businesses looking into AI is "tech fascination." We build massive swarms of autonomous agents for tasks that require a simple, reliable cron script and a single LLM API payload. To surf safely without wiping out on your balance sheets, we recommend starting with a strict friction audit. Map where your staffs keyboard clicks are most mechanical—those are the low-tide tasks ready for automation. Keep agents reserved for non-deterministic decision pathways.',
    author: {
      name: 'Kai Brooks',
      role: 'Principal Agent Architect at OTD AI',
      avatarInitials: 'KB'
    }
  },
  {
    id: 'blog-rag-understanding',
    title: 'Understanding the Tidal Flow of Memory: A Deep Dive into RAG Systems',
    category: 'AI Engineering',
    excerpt: 'Is your AI imagining contracts? Understand why Retrieval-Augmented Generation (RAG) is the lighthouse that keeps enterprise LLMs securely grounded in truth.',
    readTime: '8 min read',
    date: 'May 15, 2026',
    content: 'Retrieval-Augmented Generation is simple in theory: feed the LLM accurate context, and it will give you accurate answers. But in practice, indexing structure, document chunking overlapping limits, and relevance weights behave like turbulent water waves. Learn how we organize documents into discrete semantic semantic-shores, using custom vector configurations to match questions with exact compliance snippets every single run without burning query budgets.',
    author: {
      name: 'Dr. Marina Vance',
      role: 'Director of Retrieval Science',
      avatarInitials: 'MV'
    }
  },
  {
    id: 'blog-local-seo-conversions',
    title: 'The AI Lead Surge: Converting Approachable Tools to High-Value Partners',
    category: 'Marketing Systems',
    excerpt: 'Discover why interactive, small useful tools on lead domains are outperforming standard boring contact pages by over 400% in modern service client acquisition.',
    readTime: '6 min read',
    date: 'April 20, 2026',
    content: 'Why does OceanTideDropAISurfer.services employ a dynamic calculator and interactive planner? Because modern prospective clients do not want to download a PDF report or fill out a dry, faceless intake list. By giving users immediate, responsive value—like calculating their localized automation hours right on the homepage—we double trust levels before a human agent even dials into the call.',
    author: {
      name: 'Sarah Chen',
      role: 'Growth Director, OTD AI Services',
      avatarInitials: 'SC'
    }
  }
];
