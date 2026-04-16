"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  canAnswerQuestions,
  canContribute,
  canManageReviews,
  createActivity,
  createDiscussion,
  createDocument,
  createLesson,
  createReply,
  loadAppData,
  persistAppData,
  resetAppData,
} from "@/lib/demo-store";
import type {
  AppData,
  ContentStatus,
  Locale,
  Role,
  UploadedAsset,
} from "@/lib/types";

interface DocumentDraftInput {
  title: string;
  summary: string;
  department: string;
  category: string;
  tags: string[];
  language: string;
  region: string;
  author: string;
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
  contentSnippet: string;
  fileName: string;
  attachment?: UploadedAsset;
}

interface LessonDraftInput {
  projectName: string;
  problemEncountered: string;
  whatWasLearned: string;
  recommendedAction: string;
  department: string;
  tags: string[];
  author: string;
  region: string;
  language: string;
  relatedDocumentId?: string;
  relatedExpertId?: string;
  status: ContentStatus;
}

interface DiscussionDraftInput {
  title: string;
  question: string;
  department: string;
  tags: string[];
  author: string;
  expertIds: string[];
}

interface ReplyInput {
  discussionId: string;
  author: string;
  role: Role;
  body: string;
}

interface AppStateContextValue {
  data: AppData;
  locale: Locale;
  role: Role;
  setLocale: (locale: Locale) => void;
  setRole: (role: Role) => void;
  addDocument: (input: DocumentDraftInput) => void;
  addLesson: (input: LessonDraftInput) => void;
  addDiscussion: (input: DiscussionDraftInput) => void;
  addReply: (input: ReplyInput) => void;
  markBestAnswer: (discussionId: string, replyId: string) => void;
  approveDocument: (documentId: string) => void;
  approveLesson: (lessonId: string) => void;
  recordSearch: (query: string, source: "dashboard" | "repository") => void;
  incrementDocumentView: (documentId: string, type: "view" | "download") => void;
  canManageReviews: boolean;
  canContribute: boolean;
  canAnswerQuestions: boolean;
  resetDemo: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        setState(JSON.parse(stored) as T);
      } catch {
        setState(initialValue);
      }
    }
  }, [initialValue, key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(loadAppData());
  const [locale, setLocale] = usePersistentState<Locale>("ssgi-kms-locale", "en");
  const [role, setRole] = usePersistentState<Role>("ssgi-kms-role", "employee");

  useEffect(() => {
    setData(loadAppData());
  }, []);

  useEffect(() => {
    persistAppData(data);
  }, [data]);

  const updateData = (updater: (current: AppData) => AppData) => {
    setData((current) => updater(current));
  };

  const addDocument = (input: DocumentDraftInput) => {
    updateData((current) => {
      const document = createDocument(input);
      return {
        ...current,
        documents: [document, ...current.documents],
        activity: [
          createActivity({
            actor: input.author,
            action: input.status === "Draft" ? "saved draft" : "submitted",
            target: input.title,
            href: `/repository/${document.id}`,
            kind: "document",
          }),
          ...current.activity,
        ],
      };
    });
    toast.success(input.status === "Draft" ? "Draft saved locally." : "Knowledge submitted for review.");
  };

  const addLesson = (input: LessonDraftInput) => {
    updateData((current) => {
      const lesson = createLesson(input);
      return {
        ...current,
        lessons: [lesson, ...current.lessons],
        activity: [
          createActivity({
            actor: input.author,
            action: input.status === "Draft" ? "saved lesson draft for" : "submitted lesson for",
            target: input.projectName,
            href: "/lessons",
            kind: "lesson",
          }),
          ...current.activity,
        ],
      };
    });
    toast.success("Lesson learned saved.");
  };

  const addDiscussion = (input: DiscussionDraftInput) => {
    updateData((current) => {
      const discussion = createDiscussion(input);
      return {
        ...current,
        discussions: [discussion, ...current.discussions],
        activity: [
          createActivity({
            actor: input.author,
            action: "asked",
            target: input.title,
            href: "/discussions",
            kind: "discussion",
          }),
          ...current.activity,
        ],
      };
    });
    toast.success("Knowledge question posted.");
  };

  const addReply = (input: ReplyInput) => {
    updateData((current) => ({
      ...current,
      discussions: current.discussions.map((discussion) =>
        discussion.id === input.discussionId
          ? {
              ...discussion,
              status: "Answered",
              replies: [...discussion.replies, createReply(input)],
            }
          : discussion,
      ),
    }));
    toast.success("Reply added.");
  };

  const markBestAnswer = (discussionId: string, replyId: string) => {
    updateData((current) => ({
      ...current,
      discussions: current.discussions.map((discussion) =>
        discussion.id === discussionId
          ? {
              ...discussion,
              replies: discussion.replies.map((reply) => ({
                ...reply,
                isBest: reply.id === replyId,
              })),
            }
          : discussion,
      ),
    }));
    toast.success("Best answer marked.");
  };

  const updateDocumentStatus = (documentId: string, status: ContentStatus) => {
    updateData((current) => ({
      ...current,
      documents: current.documents.map((document) =>
        document.id === documentId ? { ...document, status } : document,
      ),
    }));
  };

  const approveDocument = (documentId: string) => {
    updateDocumentStatus(documentId, "Approved");
    toast.success("Document approved.");
  };

  const approveLesson = (lessonId: string) => {
    updateData((current) => ({
      ...current,
      lessons: current.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, status: "Approved" } : lesson,
      ),
    }));
    toast.success("Lesson approved.");
  };

  const recordSearch = (query: string, source: "dashboard" | "repository") => {
    if (!query.trim()) return;

    updateData((current) => ({
      ...current,
      searchLog: [
        {
          id: `search-${crypto.randomUUID()}`,
          query,
          source,
          date: new Date().toISOString().slice(0, 10),
        },
        ...current.searchLog,
      ].slice(0, 25),
    }));
  };

  const incrementDocumentView = (documentId: string, type: "view" | "download") => {
    updateData((current) => ({
      ...current,
      documents: current.documents.map((document) =>
        document.id === documentId
          ? {
              ...document,
              views: type === "view" ? document.views + 1 : document.views,
              downloadCount: type === "download" ? document.downloadCount + 1 : document.downloadCount,
            }
          : document,
      ),
    }));
  };

  const resetDemo = () => {
    resetAppData();
    setData(loadAppData());
    toast.success("Demo data reset to original SSGI seed content.");
  };

  const value = useMemo<AppStateContextValue>(
    () => ({
      data,
      locale,
      role,
      setLocale,
      setRole,
      addDocument,
      addLesson,
      addDiscussion,
      addReply,
      markBestAnswer,
      approveDocument,
      approveLesson,
      recordSearch,
      incrementDocumentView,
      canManageReviews: canManageReviews(role),
      canContribute: canContribute(role),
      canAnswerQuestions: canAnswerQuestions(role),
      resetDemo,
    }),
    [data, locale, role],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
