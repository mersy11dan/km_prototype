import { seedData } from "@/data/seed";
import type {
  ActivityItem,
  AppData,
  DiscussionReply,
  DiscussionThread,
  ExpertProfile,
  KnowledgeDocument,
  LessonLearned,
  Role,
} from "@/lib/types";
import { unique } from "@/lib/utils";

const STORAGE_KEY = "ssgi-kms-demo-data";

export function loadAppData(): AppData {
  if (typeof window === "undefined") {
    return seedData;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return seedData;
  }

  try {
    const parsed = JSON.parse(stored) as AppData;
    return {
      ...seedData,
      ...parsed,
    };
  } catch {
    return seedData;
  }
}

export function persistAppData(data: AppData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAppData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function canManageReviews(role: Role) {
  return role === "admin" || role === "manager";
}

export function canContribute(role: Role) {
  return role !== "viewer";
}

export function canAnswerQuestions(role: Role) {
  return role === "expert" || role === "admin" || role === "manager";
}

export function createDocument(
  document: Omit<KnowledgeDocument, "id" | "uploadDate" | "views" | "downloadCount">,
): KnowledgeDocument {
  return {
    ...document,
    id: `doc-${crypto.randomUUID()}`,
    uploadDate: new Date().toISOString().slice(0, 10),
    views: 0,
    downloadCount: 0,
  };
}

export function createLesson(lesson: Omit<LessonLearned, "id" | "date">): LessonLearned {
  return {
    ...lesson,
    id: `lesson-${crypto.randomUUID()}`,
    date: new Date().toISOString().slice(0, 10),
  };
}

export function createDiscussion(
  discussion: Omit<DiscussionThread, "id" | "date" | "views" | "replies" | "status">,
): DiscussionThread {
  return {
    ...discussion,
    id: `discussion-${crypto.randomUUID()}`,
    date: new Date().toISOString().slice(0, 10),
    views: 0,
    replies: [],
    status: "Open",
  };
}

export function createReply(reply: Omit<DiscussionReply, "id" | "date" | "isBest">): DiscussionReply {
  return {
    ...reply,
    id: `reply-${crypto.randomUUID()}`,
    date: new Date().toISOString().slice(0, 10),
    isBest: false,
  };
}

export function createActivity(item: Omit<ActivityItem, "id" | "date">): ActivityItem {
  return {
    ...item,
    id: `activity-${crypto.randomUUID()}`,
    date: new Date().toISOString().slice(0, 10),
  };
}

export function getKnowledgeGaps(data: AppData) {
  return data.taxonomy.groups
    .find((group) => group.key === "departments")
    ?.items.map((department) => ({
      department,
      approvedCount: data.documents.filter(
        (document) => document.department === department && document.status === "Approved",
      ).length,
      lessonCount: data.lessons.filter((lesson) => lesson.department === department).length,
    }))
    .map((entry) => ({
      ...entry,
      gapScore: Math.max(0, 4 - entry.approvedCount) + (entry.lessonCount === 0 ? 2 : 0),
    }))
    .sort((a, b) => b.gapScore - a.gapScore) ?? [];
}

export function getTopTopics(data: AppData) {
  const counts = new Map<string, number>();
  data.searchLog.forEach((entry) => {
    counts.set(entry.query, (counts.get(entry.query) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function getMostActiveContributors(data: AppData) {
  const names = unique([
    ...data.documents.map((item) => item.author),
    ...data.lessons.map((item) => item.author),
    ...data.discussions.map((item) => item.author),
    ...data.discussions.flatMap((item) => item.replies.map((reply) => reply.author)),
  ]);

  return names
    .map((name) => ({
      name,
      count:
        data.documents.filter((item) => item.author === name).length +
        data.lessons.filter((item) => item.author === name).length +
        data.discussions.filter((item) => item.author === name).length +
        data.discussions.flatMap((item) => item.replies).filter((reply) => reply.author === name).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function getMostViewedAssets(data: AppData) {
  return [...data.documents]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((document) => ({ name: document.title, views: document.views }));
}

export function getDocumentVolumeByDepartment(data: AppData) {
  return data.taxonomy.groups
    .find((group) => group.key === "departments")
    ?.items.map((department) => ({
      department,
      documents: data.documents.filter((document) => document.department === department).length,
    })) ?? [];
}

export function getExpertById(data: AppData, expertId: string): ExpertProfile | undefined {
  return data.experts.find((expert) => expert.id === expertId);
}
