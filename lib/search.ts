import type { KnowledgeDocument } from "@/lib/types";

export interface RepositoryFilters {
  query: string;
  department: string;
  category: string;
  region: string;
  language: string;
  fileType: string;
  status: string;
  sort: "newest" | "mostViewed" | "mostRelevant";
}

export function scoreDocument(document: KnowledgeDocument, query: string) {
  if (!query) {
    return 0;
  }

  const normalized = query.toLowerCase();
  let score = 0;

  const fields = [
    document.title,
    document.summary,
    document.department,
    document.category,
    document.author,
    document.tags.join(" "),
    document.keywords.join(" "),
    document.contentSnippet,
  ].join(" ").toLowerCase();

  if (document.title.toLowerCase().includes(normalized)) score += 6;
  if (document.keywords.join(" ").toLowerCase().includes(normalized)) score += 4;
  if (document.tags.join(" ").toLowerCase().includes(normalized)) score += 3;
  if (fields.includes(normalized)) score += 2;

  return score;
}

export function filterDocuments(
  documents: KnowledgeDocument[],
  filters: RepositoryFilters,
  canSeeNonApproved: boolean,
) {
  const filtered = documents.filter((document) => {
    if (!canSeeNonApproved && document.status !== "Approved") {
      return false;
    }

    const query = filters.query.trim().toLowerCase();
    const matchesQuery =
      !query ||
      [
        document.title,
        document.summary,
        document.department,
        document.category,
        document.author,
        document.uploadDate,
        document.tags.join(" "),
        document.keywords.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return (
      matchesQuery &&
      (!filters.department || document.department === filters.department) &&
      (!filters.category || document.category === filters.category) &&
      (!filters.region || document.region === filters.region) &&
      (!filters.language || document.language === filters.language) &&
      (!filters.fileType || document.fileType === filters.fileType) &&
      (!filters.status || document.status === filters.status)
    );
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "mostViewed") {
      return b.views - a.views;
    }
    if (filters.sort === "mostRelevant") {
      return scoreDocument(b, filters.query) - scoreDocument(a, filters.query) || b.views - a.views;
    }
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });
}

export function highlightText(text: string, query: string) {
  if (!query.trim()) {
    return [{ text, match: false }];
  }

  const normalized = query.trim();
  const regex = new RegExp(`(${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const parts = text.split(regex).filter(Boolean);

  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === normalized.toLowerCase(),
  }));
}
