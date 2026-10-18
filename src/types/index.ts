import { SM2State } from '../lib/sm2';
import { ExplanationLevel, AIModelId, SupportedLanguage } from '../lib/constants';
export type { ExplanationLevel, AIModelId, SupportedLanguage };

export type DocumentType = 'pdf' | 'docx' | 'pptx' | 'txt' | 'md' | 'web' | 'youtube';

export type PipelineStatus = 'queued' | 'parsing' | 'chunking' | 'embedding' | 'ready' | 'error';

export interface DocumentChunk {
  id: string;
  documentId: string;
  pageNumber?: number;
  timestamp?: string; // For YouTube
  text: string;
  bm25Score?: number;
  vectorScore?: number;
  rrfScore?: number;
  rerankScore?: number;
}

export interface DocumentItem {
  id: string;
  workspaceId: string;
  name: string;
  type: DocumentType;
  sizeBytes: number;
  pageCount?: number;
  durationSeconds?: number;
  chunkCount: number;
  status: PipelineStatus;
  progressPercent: number;
  error?: string;
  createdAt: string;
  url?: string;
  thumbnailUrl?: string;
  contentSample?: string;
  chunks?: DocumentChunk[];
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color: string;
  emoji: string;
  documentCount: number;
  deckCount: number;
  quizCount: number;
  isArchived?: boolean;
  createdAt: string;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber?: number;
  timestamp?: string;
  snippet: string;
  confidence: number;
}

export interface AgentReasoningStep {
  agent: 'Planner' | 'Retriever' | 'Answerer' | 'Critic';
  durationMs: number;
  status: 'completed' | 'flagged';
  outputSnippet: string;
  subQueries?: string[];
  criticVerdict?: {
    passed: boolean;
    hallucinationDetected: boolean;
    unsupportedSentence?: string;
    note: string;
  };
}

export interface RetrievalInspectionItem {
  chunkId: string;
  docName: string;
  pageOrTime: string;
  snippet: string;
  bm25Score: number;
  vectorScore: number;
  fusedRank: number;
  rerankerScore: number;
  initialRank: number;
  finalRank: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  citations?: Citation[];
  confidenceScore?: number; // 0..100
  confidenceTier?: 'high' | 'medium' | 'low';
  isNotFound?: boolean;
  isGeneralKnowledge?: boolean;
  usedMemory?: boolean;
  resolvedQuery?: string;
  explanationLevel?: ExplanationLevel;
  reasoningTrace?: AgentReasoningStep[];
  retrievalInspection?: RetrievalInspectionItem[];
}

export interface Conversation {
  id: string;
  workspaceId: string;
  title: string;
  documentScope: 'all' | 'selected' | string[]; // all, or list of doc IDs
  explanationLevel: ExplanationLevel;
  answerLanguage: SupportedLanguage;
  model: AIModelId;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface SummaryNote {
  id: string;
  workspaceId: string;
  documentId?: string;
  title: string;
  level: 'short' | 'detailed' | 'bullet' | 'terms';
  content: string;
  citations: Citation[];
  createdAt: string;
}

export type QuizQuestionType = 'mcq' | 'short_answer' | 'true_false';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | number; // index or string
  explanation: string;
  citation?: Citation;
  topic: string;
}

export interface QuizAttemptItem {
  questionId: string;
  userAnswer: string | number;
  isCorrect: boolean;
  aiGradedScore?: number; // For short answer 0..100
  aiFeedback?: string;
}

export interface Quiz {
  id: string;
  workspaceId: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timedMinutes?: number;
  questions: QuizQuestion[];
  completedAt?: string;
  scorePercent?: number;
  attempts?: QuizAttemptItem[];
  createdAt?: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  sm2: SM2State;
  dueDate: string;
  topic?: string;
  sourceDocId?: string;
  createdAt?: string;
}

export interface FlashcardDeck {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  cardCount: number;
  dueCount: number;
  cards: Flashcard[];
  createdAt: string;
}

export interface MindMapNodeData {
  label: string;
  summary: string;
  docCitation?: Citation;
  expanded?: boolean;
}

export interface StudyTask {
  id: string;
  planId: string;
  dayIndex: number;
  date: string;
  title: string;
  type: 'read' | 'quiz' | 'flashcards' | 'revise';
  durationMinutes: number;
  isCompleted: boolean;
  topic: string;
}

export interface StudyPlan {
  id: string;
  workspaceId: string;
  title: string;
  targetExamDate: string;
  dailyHours: number;
  weakTopicPriority: boolean;
  tasks: StudyTask[];
  completionRate: number;
  createdAt: string;
}

export interface WeakTopic {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  accuracyPercent: number;
  trend: 'improving' | 'declining' | 'stagnant';
  lastPracticed: string;
  suggestedAction: 'quiz' | 'flashcards' | 'explain';
  flashcardDeckId?: string;
}

export interface SkillGapAnalysis {
  id: string;
  jobTitle: string;
  companyName: string;
  overallMatchScore: number;
  matchedSkills: { name: string; evidence: string }[];
  partialSkills: { name: string; gap: string }[];
  missingSkills: { name: string; priority: 'high' | 'medium' | 'low'; recommendedResource: string }[];
  atsChecklist: { item: string; passed: boolean; tip: string }[];
  resumeScoreBreakdown: {
    impact: number;
    clarity: number;
    keywords: number;
    formatting: number;
    quantification: number;
  };
  sectionSuggestions: { section: string; suggestion: string }[];
}

export interface BulletRewriteItem {
  id: string;
  original: string;
  improved: string;
  diffSummary: string;
  quantificationScore: number;
  metricAdded: string;
}

export interface RoadmapMilestone {
  id: string;
  week: number;
  title: string;
  description: string;
  estimatedHours: number;
  isCompleted: boolean;
  skillsGained: string[];
  resources: { name: string; type: 'doc' | 'course' | 'practice'; url?: string }[];
}

export interface MockInterviewQuestion {
  id: string;
  prompt: string;
  type: 'technical' | 'behavioral' | 'mixed';
  source: 'JD' | 'Notes' | 'Mixed';
  sourceNoteTitle?: string;
  expectedKeywords: string[];
}

export interface InterviewFeedback {
  rubric: {
    clarity: number;
    depth: number;
    structure: number;
    confidence: number;
  };
  fillerCount: number;
  fillerWords: string[];
  speakingPaceWpm: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

export interface RAGEvalMetric {
  metricName: string;
  baselineScore: number;
  hybridScore: number;
  rerankedScore: number;
  target: number;
  description: string;
}

export interface RAGEvalTestCase {
  id: string;
  query: string;
  retrievedContext: string;
  groundTruth: string;
  faithfulness: number;
  relevance: number;
  latencyMs: number;
  passed: boolean;
}

export interface MemoryFact {
  id: string;
  workspaceId: string;
  fact: string;
  isPinned: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  goal: string;
  streakDays: number;
  preferredLanguage: SupportedLanguage;
  defaultModel: AIModelId;
  defaultExplanationLevel: ExplanationLevel;
  hybridSearchEnabled: boolean;
  rerankerEnabled: boolean;
  topK: number;
  memoryEnabled: boolean;
  /** Topics picked during onboarding (server-side in real mode). */
  subjects?: string[];
  /** False until onboarding is finished; real mode reads this from the server. */
  onboarded?: boolean;
}

// ---------------------------------------------------------------------------
// AI provider status (GET /ai/status) — real mode only
// ---------------------------------------------------------------------------

export type AIProviderHealth = 'ok' | 'degraded' | 'error' | 'not_configured';

export type CircuitBreakerState = 'closed' | 'open' | 'half_open';

export interface AIProviderStatus {
  provider: string;
  configured: boolean;
  status: AIProviderHealth;
  model?: string;
  breakerState: CircuitBreakerState;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  /** Coarse class only (rate_limited, timeout, ...); never a provider body. */
  lastErrorCode?: string;
}

export interface AIQuota {
  day: string;
  used: number;
  limit: number;
  remaining: number;
}

export interface AIStatus {
  providers: AIProviderStatus[];
  quota: AIQuota;
}

export interface QuickAskTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface QuickAskResult {
  text: string;
  provider?: string;
  model?: string;
  usage?: QuickAskTokenUsage;
}
