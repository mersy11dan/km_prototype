export type Role = "admin" | "manager" | "expert" | "employee" | "viewer";
export type Locale = "en" | "am";
export type ContentStatus = "Draft" | "Under Review" | "Approved" | "Archived";
export type AvailabilityStatus = "Available" | "Limited" | "Field Mission" | "On Leave";

export type TaxonomyGroupKey =
  | "departments"
  | "processes"
  | "projectTypes"
  | "regions"
  | "languages"
  | "knowledgeTypes";

export interface TaxonomyGroup {
  key: TaxonomyGroupKey;
  title: string;
  description: string;
  items: string[];
}

export interface Taxonomy {
  groups: TaxonomyGroup[];
}

export interface UploadedAsset {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  summary: string;
  department: string;
  category: string;
  tags: string[];
  language: string;
  region: string;
  author: string;
  uploadDate: string;
  fileType: string;
  accessLevel: string;
  relatedKnowledgeIds: string[];
  relatedLessonIds: string[];
  relatedExpertIds: string[];
  keywords: string[];
  process: string;
  projectType: string;
  knowledgeType: string;
  status: ContentStatus;
  views: number;
  downloadCount: number;
  contentSnippet: string;
  fileName: string;
  attachment?: UploadedAsset;
}

export interface LessonLearned {
  id: string;
  projectName: string;
  problemEncountered: string;
  whatWasLearned: string;
  recommendedAction: string;
  department: string;
  tags: string[];
  author: string;
  date: string;
  region: string;
  language: string;
  relatedDocumentId?: string;
  relatedExpertId?: string;
  status: ContentStatus;
}

export interface ExpertProfile {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  specialty: string;
  location: string;
  region: string;
  yearsOfExperience: number;
  contactChannel: string;
  knowledgeAreas: string[];
  availabilityStatus: AvailabilityStatus;
  bio: string;
  publications: string[];
  projectsHandled: string[];
  lessonIds: string[];
  documentIds: string[];
}

export interface DiscussionReply {
  id: string;
  author: string;
  role: Role;
  body: string;
  date: string;
  isBest: boolean;
}

export interface DiscussionThread {
  id: string;
  title: string;
  question: string;
  department: string;
  tags: string[];
  author: string;
  date: string;
  expertIds: string[];
  status: "Open" | "Answered" | "Pending Review";
  views: number;
  replies: DiscussionReply[];
}

export interface SearchLogEntry {
  id: string;
  query: string;
  date: string;
  source: "dashboard" | "repository";
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  date: string;
  href: string;
  kind: "document" | "lesson" | "discussion" | "approval" | "expert";
}

export interface AppData {
  documents: KnowledgeDocument[];
  lessons: LessonLearned[];
  experts: ExpertProfile[];
  discussions: DiscussionThread[];
  searchLog: SearchLogEntry[];
  activity: ActivityItem[];
  taxonomy: Taxonomy;
}
