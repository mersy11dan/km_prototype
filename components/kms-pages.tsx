"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Download,
  FileCheck2,
  Filter,
  FolderOpen,
  Languages,
  MapPinned,
  MessageSquarePlus,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRoundSearch,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  buildUploadedAsset,
  formatFileSize,
  validateUploadFile,
} from "@/lib/uploads";
import {
  getDocumentVolumeByDepartment,
  getKnowledgeGaps,
  getMostActiveContributors,
  getMostViewedAssets,
  getTopTopics,
} from "@/lib/demo-store";
import { t } from "@/lib/i18n";
import { filterDocuments, highlightText, type RepositoryFilters } from "@/lib/search";
import type {
  AvailabilityStatus,
  ContentStatus,
  DiscussionThread,
  ExpertProfile,
  KnowledgeDocument,
  LessonLearned,
} from "@/lib/types";
import { cn, formatDate, unique } from "@/lib/utils";

const chartColors = ["#0a2540", "#f3a712", "#c1121f", "#2f6f9f", "#506d84"];

function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ssgi-blue)]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>
        <div className="rounded-2xl bg-[var(--ssgi-blue-soft)] p-3 text-[var(--ssgi-blue)]">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ContentStatus | DiscussionThread["status"] | AvailabilityStatus }) {
  const variant =
    status === "Approved" || status === "Answered" || status === "Available"
      ? "success"
      : status === "Draft" || status === "Limited"
        ? "neutral"
        : status === "Under Review" || status === "Pending Review" || status === "Field Mission"
          ? "warning"
          : "danger";

  return <Badge variant={variant}>{status}</Badge>;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = highlightText(text, query);
  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          className={part.match ? "rounded bg-[var(--ssgi-gold)]/35 px-0.5" : undefined}
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 text-center">
        <p className="text-lg font-semibold">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const { data, locale, role, recordSearch } = useAppState();
  const [query, setQuery] = useState("satellite mapping procedure");

  const approvedDocuments = data.documents.filter((item) => item.status === "Approved");
  const popularTags = unique(data.documents.flatMap((item) => item.tags)).slice(0, 8);

  const handleSearch = () => {
    recordSearch(query, "dashboard");
    router.push(`/repository?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SSGI Enterprise KMS"
        title={t(locale, "appName")}
        description="A polished, demo-ready prototype supporting knowledge audit, innovation, quality assurance, localization, and tacit knowledge retention for the Ethiopian Space Science and Geospatial Institute."
        actions={
          <>
            <Link href="/upload">
              <Button>{t(locale, "upload")}</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline">{t(locale, "analytics")}</Button>
            </Link>
          </>
        }
      />

      <Card className="overflow-hidden bg-[linear-gradient(135deg,#0a2540_0%,#103b61_55%,#1d5d8f_100%)] text-white">
        <CardContent className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Badge className="bg-[var(--ssgi-gold)] text-[var(--ssgi-ink)]">Knowledge Audit Ready</Badge>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              Preserve expert knowledge before it is lost, and make mission-critical guidance instantly searchable.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Built around SSGI workflows in satellite operations, geospatial information, disaster monitoring,
              localization, and quality-controlled knowledge reuse.
            </p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-3 py-3 text-[var(--ssgi-ink)]">
                <Search className="h-5 w-5 text-[var(--ssgi-blue)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Search SOPs, standards, experts, lessons learned..."
                />
              </div>
              <Button variant="secondary" size="lg" onClick={handleSearch}>
                Search Repository
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Active role</p>
              <p className="mt-1 text-xl font-bold capitalize">{role}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Localization</p>
              <p className="mt-1 text-xl font-bold">{locale === "en" ? "English + Amharic" : "አማርኛ የተመረጠ"}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Knowledge coverage</p>
              <p className="mt-1 text-xl font-bold">{approvedDocuments.length}/8 departments seeded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Documents" value={data.documents.length} helper="Explicit knowledge assets" icon={FolderOpen} />
        <MetricCard label="Lessons Learned" value={data.lessons.length} helper="Tacit knowledge captured" icon={BookOpen} />
        <MetricCard label="Experts" value={data.experts.length} helper="Specialists in directory" icon={Users} />
        <MetricCard label="Departments" value={8} helper="SSGI taxonomy units" icon={ShieldCheck} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardContent>
            <SectionTitle title={t(locale, "quickActions")} description="Fully clickable demo journey" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                { href: "/upload", label: "Upload Knowledge", icon: UploadCloud },
                { href: "/repository", label: "Search Repository", icon: Search },
                { href: "/lessons", label: "Add Lesson Learned", icon: BookOpen },
                { href: "/experts", label: "Find Expert", icon: UserRoundSearch },
                { href: "/taxonomy", label: "View Taxonomy", icon: Filter },
                { href: "/analytics", label: "Analytics Dashboard", icon: Activity },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="rounded-2xl border border-[var(--ssgi-border)] bg-[var(--ssgi-surface-strong)] p-4 transition hover:border-[var(--ssgi-blue)] hover:shadow-md">
                      <Icon className="h-5 w-5 text-[var(--ssgi-blue)]" />
                      <p className="mt-3 font-semibold">{item.label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Popular tags" description="Frequently accessed themes across SSGI knowledge assets" />
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent>
            <SectionTitle title={t(locale, "recentUploads")} description="Latest explicit knowledge entering the repository" />
            <div className="space-y-3">
              {data.documents.slice(0, 4).map((document) => (
                <Link key={document.id} href={`/repository/${document.id}`}>
                  <div className="rounded-2xl border border-[var(--ssgi-border)] p-4 transition hover:border-[var(--ssgi-blue)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{document.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {document.department} · {document.region} · {document.author}
                        </p>
                      </div>
                      <StatusBadge status={document.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Activity feed" description="Recent knowledge actions and quality review events" />
            <div className="space-y-4">
              {data.activity.slice(0, 5).map((item) => (
                <Link key={item.id} href={item.href} className="block rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <p className="text-sm font-semibold">
                    {item.actor} {item.action} <span className="text-[var(--ssgi-blue)]">{item.target}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(item.date)}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RepositoryPage({ initialQuery = "" }: { initialQuery?: string }) {
  const { data, role, locale, recordSearch } = useAppState();
  const [filters, setFilters] = useState<RepositoryFilters>({
    query: initialQuery,
    department: "",
    category: "",
    region: "",
    language: "",
    fileType: "",
    status: "",
    sort: "mostRelevant",
  });

  const departments = data.taxonomy.groups.find((group) => group.key === "departments")?.items ?? [];
  const filtered = useMemo(
    () => filterDocuments(data.documents, filters, role !== "viewer"),
    [data.documents, filters, role],
  );

  useEffect(() => {
    if (initialQuery) {
      recordSearch(initialQuery, "repository");
    }
  }, [initialQuery, recordSearch]);

  const categories = unique(data.documents.map((item) => item.category));
  const regions = unique(data.documents.map((item) => item.region));
  const languages = unique(data.documents.map((item) => item.language));
  const fileTypes = unique(data.documents.map((item) => item.fileType));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Searchable repository"
        title="Knowledge Repository"
        description="Search explicit knowledge by title, metadata, department, taxonomy, author, region, language, and quality status."
        actions={
          <Link href="/upload">
            <Button>{t(locale, "upload")}</Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="grid gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Input
              value={filters.query}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Search by title, keyword, author, department, tag, or date"
            />
          </div>
          <Select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as RepositoryFilters["sort"] }))}>
            <option value="mostRelevant">Most relevant</option>
            <option value="newest">Newest</option>
            <option value="mostViewed">Most viewed</option>
          </Select>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setFilters({ query: "", department: "", category: "", region: "", language: "", fileType: "", status: "", sort: "mostRelevant" })}>
              Clear filters
            </Button>
          </div>

          <Select value={filters.department} onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value }))}>
            <option value="">All departments</option>
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}>
            <option value="">All regions</option>
            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.language} onChange={(event) => setFilters((current) => ({ ...current, language: event.target.value }))}>
            <option value="">All languages</option>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.fileType} onChange={(event) => setFilters((current) => ({ ...current, fileType: event.target.value }))}>
            <option value="">All document types</option>
            {fileTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            {["Draft", "Under Review", "Approved", "Archived"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No matching knowledge assets" description="Try a broader search term or remove some filters." />
      ) : (
        <div className="grid gap-4">
          {filtered.map((document) => (
            <Link key={document.id} href={`/repository/${document.id}`}>
              <Card className="transition hover:border-[var(--ssgi-blue)]">
                <CardContent>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={document.status} />
                        <Badge variant="neutral">{document.fileType}</Badge>
                        <Badge>{document.department}</Badge>
                      </div>
                      <h3 className="text-xl font-bold">
                        <Highlighted text={document.title} query={filters.query} />
                      </h3>
                      <p className="text-sm leading-6 text-slate-600">
                        <Highlighted text={document.summary} query={filters.query} />
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="neutral">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-500">
                      <span>Author: {document.author}</span>
                      <span>Date: {formatDate(document.uploadDate)}</span>
                      <span>Region: {document.region}</span>
                      <span>Language: {document.language}</span>
                      <span>Views: {document.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function DocumentDetailPage({ id }: { id: string }) {
  const { data, incrementDocumentView, approveDocument, canManageReviews } = useAppState();
  const document = data.documents.find((item) => item.id === id);

  useEffect(() => {
    if (document) {
      incrementDocumentView(document.id, "view");
    }
  }, [document, incrementDocumentView]);

  if (!document) {
    return <EmptyState title="Document not found" description="The requested knowledge asset is not available." />;
  }

  const relatedLessons = data.lessons.filter((lesson) => document.relatedLessonIds.includes(lesson.id));
  const relatedExperts = data.experts.filter((expert) => document.relatedExpertIds.includes(expert.id));
  const relatedDocs = data.documents.filter((item) => document.relatedKnowledgeIds.includes(item.id));

  const handleDownload = () => {
    incrementDocumentView(document.id, "download");

    if (document.attachment?.dataUrl) {
      const link = window.document.createElement("a");
      link.href = document.attachment.dataUrl;
      link.download = document.fileName;
      link.click();
      toast.success(`${document.fileName} uploaded file downloaded successfully.`);
      return;
    }

    toast.success(`Demo file reference opened for ${document.fileName}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={document.department}
        title={document.title}
        description={document.summary}
        actions={
          <>
            <Button
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            {canManageReviews && document.status !== "Approved" ? (
              <Button onClick={() => approveDocument(document.id)}>Approve content</Button>
            ) : null}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={document.status} />
              <Badge>{document.category}</Badge>
              <Badge variant="neutral">{document.knowledgeType}</Badge>
            </div>
            <p className="leading-7 text-slate-700">{document.contentSnippet}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Department" value={document.department} />
              <Info label="Process" value={document.process} />
              <Info label="Project type" value={document.projectType} />
              <Info label="Region" value={document.region} />
              <Info label="Language" value={document.language} />
              <Info label="Access level" value={document.accessLevel} />
              <Info label="Author" value={document.author} />
              <Info label="Upload date" value={formatDate(document.uploadDate)} />
              <Info
                label="Attachment"
                value={
                  document.attachment
                    ? `${document.attachment.name} (${formatFileSize(document.attachment.size)})`
                    : document.fileName
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <SectionTitle title="Related lessons learned" description="Connected tacit knowledge from operational experience" />
              <div className="space-y-3">
                {relatedLessons.map((lesson) => (
                  <Link key={lesson.id} href="/lessons" className="block rounded-2xl border border-[var(--ssgi-border)] p-4">
                    <p className="font-semibold">{lesson.projectName}</p>
                    <p className="mt-1 text-sm text-slate-500">{lesson.whatWasLearned}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle title="Responsible experts" description="People who can provide tacit guidance" />
              <div className="space-y-3">
                {relatedExperts.map((expert) => (
                  <Link key={expert.id} href={`/experts/${expert.id}`} className="block rounded-2xl border border-[var(--ssgi-border)] p-4">
                    <p className="font-semibold">{expert.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {expert.roleTitle} · {expert.specialty}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle title="Related knowledge" description="Cross-linked enterprise assets" />
              <div className="space-y-3">
                {relatedDocs.map((item) => (
                  <Link key={item.id} href={`/repository/${item.id}`} className="block rounded-2xl border border-[var(--ssgi-border)] p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.department}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[var(--ssgi-surface-strong)] p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

export function UploadPage() {
  const { data, role, addDocument, canContribute } = useAppState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedAsset, setUploadedAsset] = useState<KnowledgeDocument["attachment"]>();
  const [form, setForm] = useState({
    title: "",
    summary: "",
    department: data.taxonomy.groups.find((group) => group.key === "departments")?.items[0] ?? "",
    category: "Operations Manual",
    tags: "satellite, mapping",
    language: "English",
    region: "Addis Ababa",
    author: "Demo User",
    fileType: "PDF",
    accessLevel: "Internal",
    relatedKnowledgeIds: [] as string[],
    relatedLessonIds: [] as string[],
    relatedExpertIds: [] as string[],
    keywords: "satellite mapping procedure, mission readiness",
    process: "Satellite operations",
    projectType: "Earth observation mission",
    knowledgeType: "SOP",
    contentSnippet: "Preview generated from uploaded file metadata and knowledge summary.",
    fileName: "",
  });

  const resetForm = () => {
    setForm({
      title: "",
      summary: "",
      department: data.taxonomy.groups.find((group) => group.key === "departments")?.items[0] ?? "",
      category: "Operations Manual",
      tags: "satellite, mapping",
      language: "English",
      region: "Addis Ababa",
      author: "Demo User",
      fileType: "PDF",
      accessLevel: "Internal",
      relatedKnowledgeIds: [],
      relatedLessonIds: [],
      relatedExpertIds: [],
      keywords: "satellite mapping procedure, mission readiness",
      process: "Satellite operations",
      projectType: "Earth observation mission",
      knowledgeType: "SOP",
      contentSnippet: "Preview generated from uploaded file metadata and knowledge summary.",
      fileName: "",
    });
    setUploadedAsset(undefined);
    setUploadError("");
  };

  const handleFileSelected = async (file?: File | null) => {
    if (!file) return;

    const validation = validateUploadFile(file);
    if (!validation.valid) {
      const errorMessage = validation.error ?? "Unsupported file upload.";
      setUploadError(errorMessage);
      setUploadedAsset(undefined);
      toast.error(errorMessage);
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const asset = await buildUploadedAsset(file);
      const inferredTitle = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

      setUploadedAsset(asset);
      setForm((current) => ({
        ...current,
        title: current.title || inferredTitle,
        fileName: asset.name,
        fileType: file.name.split(".").pop()?.toUpperCase() || current.fileType,
      }));
      toast.success(`${asset.name} uploaded and attached successfully.`);
    } catch {
      setUploadError("The selected file could not be processed. Please try another file.");
      setUploadedAsset(undefined);
      toast.error("Upload failed while reading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (status: ContentStatus) => {
    if (!uploadedAsset) {
      const error = "Please attach a supported file before publishing.";
      setUploadError(error);
      toast.error(error);
      return;
    }

    if (!form.title.trim() || !form.summary.trim()) {
      toast.error("Title and summary are required before saving the upload.");
      return;
    }

    addDocument({
      ...form,
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean),
      status: role === "viewer" ? "Draft" : status,
      attachment: uploadedAsset,
    });
    resetForm();
  };

  if (!canContribute) {
    return <EmptyState title="Viewer access" description="Viewers can browse approved content but cannot upload new knowledge." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Upload workflow"
        title="Upload Knowledge"
        description="Drag and drop a file, complete enterprise metadata, preview the publication package, and save as draft or submit for review."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.png,.jpg,.jpeg"
              onChange={(event) => {
                void handleFileSelected(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                void handleFileSelected(event.dataTransfer.files[0]);
              }}
              className={cn(
                "rounded-3xl border-2 border-dashed p-8 text-center transition",
                isDragging
                  ? "border-[var(--ssgi-blue)] bg-[var(--ssgi-blue-soft)]"
                  : "border-[var(--ssgi-border)] bg-[var(--ssgi-surface-muted)]",
              )}
            >
              <UploadCloud className="mx-auto h-10 w-10 text-[var(--ssgi-blue)]" />
              <p className="mt-4 font-semibold text-[var(--ssgi-blue-strong)]">Drag and drop a knowledge file here</p>
              <p className="mt-2 text-sm text-slate-500">
                Supported: PDF, DOCX, XLSX, PPTX, TXT, CSV, PNG, JPG up to {formatFileSize(1_000_000)}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                  Choose file
                </Button>
                <Badge variant={uploadedAsset ? "success" : "neutral"}>
                  {isUploading
                    ? "Processing upload..."
                    : uploadedAsset
                      ? `${uploadedAsset.name} attached`
                      : "No file selected"}
                </Badge>
              </div>
              {uploadedAsset ? (
                <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-[var(--ssgi-border)] bg-white/90 p-4 text-left shadow-sm">
                  <p className="font-semibold">{uploadedAsset.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {form.fileType} · {formatFileSize(uploadedAsset.size)}
                  </p>
                </div>
              ) : null}
              {uploadError ? <p className="mt-4 text-sm font-medium text-[var(--ssgi-red)]">{uploadError}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              <Input placeholder="Author" value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} />
              <Select value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}>
                {data.taxonomy.groups.find((group) => group.key === "departments")?.items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Input placeholder="Category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
              <Input placeholder="Language" value={form.language} onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))} />
              <Input placeholder="Region" value={form.region} onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))} />
              <Input placeholder="File type" value={form.fileType} onChange={(event) => setForm((current) => ({ ...current, fileType: event.target.value }))} />
              <Input placeholder="Access level" value={form.accessLevel} onChange={(event) => setForm((current) => ({ ...current, accessLevel: event.target.value }))} />
              <Input placeholder="Process" value={form.process} onChange={(event) => setForm((current) => ({ ...current, process: event.target.value }))} />
              <Input placeholder="Project type" value={form.projectType} onChange={(event) => setForm((current) => ({ ...current, projectType: event.target.value }))} />
              <Input placeholder="Knowledge type" value={form.knowledgeType} onChange={(event) => setForm((current) => ({ ...current, knowledgeType: event.target.value }))} />
              <Input placeholder="Tags comma separated" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
            </div>
            <Textarea placeholder="Summary" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
            <Textarea placeholder="Keywords comma separated" value={form.keywords} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} />
            <Textarea placeholder="Preview snippet" value={form.contentSnippet} onChange={(event) => setForm((current) => ({ ...current, contentSnippet: event.target.value }))} />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleSubmit("Draft")}>
                Save draft
              </Button>
              <Button onClick={() => handleSubmit("Under Review")}>Submit for review</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <SectionTitle title="Publishing preview" description="What reviewers and repository users will see" />
            <div className="rounded-3xl border border-[var(--ssgi-border)] bg-white/85 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={uploadedAsset ? "Under Review" : "Draft"} />
                <Badge>{form.department}</Badge>
                <Badge variant="neutral">{form.fileType}</Badge>
              </div>
              <h3 className="mt-4 text-xl font-bold">{form.title || "Draft knowledge title"}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {form.summary || "Metadata preview will appear here as the knowledge asset is prepared for publication."}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Author" value={form.author || "Demo User"} />
                <Info label="Access" value={form.accessLevel} />
                <Info label="Region" value={form.region} />
                <Info label="Language" value={form.language} />
                <Info label="Upload status" value={uploadedAsset ? "File attached and ready" : "Waiting for file"} />
                <Info label="Attachment" value={uploadedAsset ? uploadedAsset.name : "No file attached"} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {form.tags
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TacitKnowledgePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tacit knowledge capture"
        title="Human expertise retention"
        description="Capture what teams learn in projects, surface experts, and keep operational know-how discoverable even when people transition."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/lessons">
          <Card className="h-full transition hover:border-[var(--ssgi-blue)]">
            <CardContent>
              <BookOpen className="h-8 w-8 text-[var(--ssgi-blue)]" />
              <h3 className="mt-4 text-xl font-bold">Lessons Learned Log</h3>
              <p className="mt-2 text-sm text-slate-500">Submit project lessons, recommended actions, and quality insights.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/experts">
          <Card className="h-full transition hover:border-[var(--ssgi-blue)]">
            <CardContent>
              <Users className="h-8 w-8 text-[var(--ssgi-blue)]" />
              <h3 className="mt-4 text-xl font-bold">Expert Locator</h3>
              <p className="mt-2 text-sm text-slate-500">Discover specialists by department, region, availability, and expertise area.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/discussions">
          <Card className="h-full transition hover:border-[var(--ssgi-blue)]">
            <CardContent>
              <MessageSquarePlus className="h-8 w-8 text-[var(--ssgi-blue)]" />
              <h3 className="mt-4 text-xl font-bold">Knowledge Questions</h3>
              <p className="mt-2 text-sm text-slate-500">Ask operational questions, tag experts, and mark the best answer.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export function LessonsPage() {
  const { data, addLesson, role, canContribute, canManageReviews, approveLesson } = useAppState();
  const [form, setForm] = useState({
    projectName: "",
    problemEncountered: "",
    whatWasLearned: "",
    recommendedAction: "",
    department: data.taxonomy.groups.find((group) => group.key === "departments")?.items[0] ?? "",
    tags: "lesson, knowledge retention",
    author: "Demo User",
    region: "Addis Ababa",
    language: "English",
    relatedDocumentId: data.documents[0]?.id ?? "",
    relatedExpertId: data.experts[0]?.id ?? "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lessons learned"
        title="Operational Learning Log"
        description="Capture problems encountered, what teams learned, and recommended actions so future missions can avoid repeating mistakes."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardContent className="space-y-4">
            <SectionTitle title="Submit lesson learned" description="Useful for experts and employees documenting project experience" />
            {canContribute ? (
              <>
                <Input placeholder="Project name" value={form.projectName} onChange={(event) => setForm((current) => ({ ...current, projectName: event.target.value }))} />
                <Textarea placeholder="Problem encountered" value={form.problemEncountered} onChange={(event) => setForm((current) => ({ ...current, problemEncountered: event.target.value }))} />
                <Textarea placeholder="What was learned" value={form.whatWasLearned} onChange={(event) => setForm((current) => ({ ...current, whatWasLearned: event.target.value }))} />
                <Textarea placeholder="Recommended action" value={form.recommendedAction} onChange={(event) => setForm((current) => ({ ...current, recommendedAction: event.target.value }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Select value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}>
                    {data.taxonomy.groups.find((group) => group.key === "departments")?.items.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                  <Input placeholder="Author" value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} />
                  <Input placeholder="Tags comma separated" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
                  <Input placeholder="Region" value={form.region} onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))} />
                </div>
                <Button
                  onClick={() =>
                    addLesson({
                      ...form,
                      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
                      status: role === "admin" ? "Approved" : "Under Review",
                    })
                  }
                >
                  Add lesson learned
                </Button>
              </>
            ) : (
              <EmptyState title="Contribution restricted" description="Switch to Employee, Expert, Manager, or Admin to submit lessons." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Captured lessons" description="Tacit knowledge already retained in the prototype" />
            <div className="space-y-4">
              {data.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{lesson.projectName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {lesson.department} · {lesson.author} · {formatDate(lesson.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={lesson.status} />
                      {canManageReviews && lesson.status !== "Approved" ? (
                        <Button size="sm" onClick={() => approveLesson(lesson.id)}>
                          Approve
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Problem:</span> {lesson.problemEncountered}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Learned:</span> {lesson.whatWasLearned}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Action:</span> {lesson.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DiscussionsPage() {
  const { data, addDiscussion, addReply, canAnswerQuestions, canContribute, markBestAnswer, role } = useAppState();
  const [questionForm, setQuestionForm] = useState({
    title: "",
    question: "",
    department: data.taxonomy.groups.find((group) => group.key === "departments")?.items[0] ?? "",
    tags: "knowledge question, support",
    author: "Demo User",
    expertIds: [data.experts[0]?.id ?? ""],
  });
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discussion area"
        title="Knowledge Questions and Answers"
        description="Ask questions, tag experts, reply to discussions, and mark the most useful answer to retain tacit know-how."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardContent className="space-y-4">
            <SectionTitle title="Post a question" description="Employees and experts can ask knowledge questions" />
            {canContribute ? (
              <>
                <Input placeholder="Question title" value={questionForm.title} onChange={(event) => setQuestionForm((current) => ({ ...current, title: event.target.value }))} />
                <Textarea placeholder="Question details" value={questionForm.question} onChange={(event) => setQuestionForm((current) => ({ ...current, question: event.target.value }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Select value={questionForm.department} onChange={(event) => setQuestionForm((current) => ({ ...current, department: event.target.value }))}>
                    {data.taxonomy.groups.find((group) => group.key === "departments")?.items.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                  <Input placeholder="Author" value={questionForm.author} onChange={(event) => setQuestionForm((current) => ({ ...current, author: event.target.value }))} />
                </div>
                <Input placeholder="Tags comma separated" value={questionForm.tags} onChange={(event) => setQuestionForm((current) => ({ ...current, tags: event.target.value }))} />
                <div className="rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <p className="mb-3 text-sm font-semibold">Tag experts</p>
                  <div className="grid gap-2">
                    {data.experts.map((expert) => (
                      <label key={expert.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={questionForm.expertIds.includes(expert.id)}
                          onChange={(event) =>
                            setQuestionForm((current) => ({
                              ...current,
                              expertIds: event.target.checked
                                ? [...current.expertIds, expert.id]
                                : current.expertIds.filter((item) => item !== expert.id),
                            }))
                          }
                        />
                        {expert.name} - {expert.specialty}
                      </label>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() =>
                    addDiscussion({
                      ...questionForm,
                      tags: questionForm.tags.split(",").map((item) => item.trim()).filter(Boolean),
                    })
                  }
                >
                  Post question
                </Button>
              </>
            ) : (
              <EmptyState title="Viewer access" description="Viewers can read discussions but cannot post new questions." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Most useful discussions" description="Open and answered threads connected to SSGI operations" />
            <div className="space-y-4">
              {data.discussions.map((discussion) => (
                <div key={discussion.id} className="rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{discussion.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {discussion.department} · {discussion.author} · {discussion.views} views
                      </p>
                    </div>
                    <StatusBadge status={discussion.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{discussion.question}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 space-y-3">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="rounded-2xl bg-[var(--ssgi-surface-strong)] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">
                            {reply.author} · <span className="capitalize text-[var(--ssgi-blue)]">{reply.role}</span>
                          </p>
                          <div className="flex items-center gap-2">
                            {reply.isBest ? <Badge variant="success">Best answer</Badge> : null}
                            {canAnswerQuestions && !reply.isBest ? (
                              <Button size="sm" variant="outline" onClick={() => markBestAnswer(discussion.id, reply.id)}>
                                Mark best
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                  {canAnswerQuestions ? (
                    <div className="mt-4 flex gap-3">
                      <Input
                        placeholder="Reply with operational guidance..."
                        value={replyDrafts[discussion.id] ?? ""}
                        onChange={(event) =>
                          setReplyDrafts((current) => ({
                            ...current,
                            [discussion.id]: event.target.value,
                          }))
                        }
                      />
                      <Button
                        onClick={() =>
                          addReply({
                            discussionId: discussion.id,
                            author: role === "expert" ? "Assigned Expert" : "Admin Reviewer",
                            role,
                            body: replyDrafts[discussion.id] ?? "",
                          })
                        }
                      >
                        Reply
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ExpertsPage() {
  const { data } = useAppState();
  const [filters, setFilters] = useState({
    department: "",
    specialty: "",
    region: "",
    availability: "",
    experience: "",
  });

  const experts = data.experts.filter((expert) => {
    return (
      (!filters.department || expert.department === filters.department) &&
      (!filters.specialty || expert.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) &&
      (!filters.region || expert.region === filters.region) &&
      (!filters.availability || expert.availabilityStatus === filters.availability) &&
      (!filters.experience ||
        (filters.experience === "senior" ? expert.yearsOfExperience >= 10 : expert.yearsOfExperience < 10))
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Expert locator"
        title="SSGI Expert Directory"
        description="Find experts by department, specialty, region, availability, and experience level."
      />

      <Card>
        <CardContent className="grid gap-3 lg:grid-cols-5">
          <Select value={filters.department} onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value }))}>
            <option value="">All departments</option>
            {data.taxonomy.groups.find((group) => group.key === "departments")?.items.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Input placeholder="Specialty" value={filters.specialty} onChange={(event) => setFilters((current) => ({ ...current, specialty: event.target.value }))} />
          <Select value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}>
            <option value="">All regions</option>
            {unique(data.experts.map((expert) => expert.region)).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.availability} onChange={(event) => setFilters((current) => ({ ...current, availability: event.target.value }))}>
            <option value="">All availability</option>
            {unique(data.experts.map((expert) => expert.availabilityStatus)).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={filters.experience} onChange={(event) => setFilters((current) => ({ ...current, experience: event.target.value }))}>
            <option value="">Any experience</option>
            <option value="senior">Senior 10+ years</option>
            <option value="mid">Mid under 10 years</option>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {experts.map((expert) => (
          <Link key={expert.id} href={`/experts/${expert.id}`}>
            <Card className="h-full transition hover:border-[var(--ssgi-blue)]">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{expert.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{expert.roleTitle}</p>
                  </div>
                  <StatusBadge status={expert.availabilityStatus} />
                </div>
                <p className="mt-4 text-sm text-slate-600">{expert.bio}</p>
                <div className="mt-4 grid gap-2 text-sm text-slate-500">
                  <span>{expert.department}</span>
                  <span>{expert.specialty}</span>
                  <span>
                    {expert.region} · {expert.yearsOfExperience} years
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {expert.knowledgeAreas.slice(0, 3).map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ExpertDetailPage({ id }: { id: string }) {
  const { data } = useAppState();
  const expert = data.experts.find((item) => item.id === id);

  if (!expert) {
    return <EmptyState title="Expert not found" description="The requested profile is unavailable." />;
  }

  const documents = data.documents.filter((document) => expert.documentIds.includes(document.id));
  const lessons = data.lessons.filter((lesson) => expert.lessonIds.includes(lesson.id));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={expert.department}
        title={expert.name}
        description={expert.bio}
        actions={<StatusBadge status={expert.availabilityStatus} />}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardContent className="space-y-4">
            <Info label="Role" value={expert.roleTitle} />
            <Info label="Specialty" value={expert.specialty} />
            <Info label="Location" value={expert.location} />
            <Info label="Experience" value={`${expert.yearsOfExperience} years`} />
            <Info label="Contact" value={expert.contactChannel} />
            <div className="flex flex-wrap gap-2">
              {expert.knowledgeAreas.map((area) => (
                <Badge key={area}>{area}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <SectionTitle title="Projects handled" description="Representative operational and research work" />
              <div className="space-y-2">
                {expert.projectsHandled.map((project) => (
                  <div key={project} className="rounded-xl bg-[var(--ssgi-surface-strong)] px-4 py-3">
                    {project}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle title="Publications and contributions" description="Associated explicit knowledge assets" />
              <div className="space-y-3">
                {documents.map((document) => (
                  <Link key={document.id} href={`/repository/${document.id}`} className="block rounded-2xl border border-[var(--ssgi-border)] p-4">
                    <p className="font-semibold">{document.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{document.category}</p>
                  </Link>
                ))}
                {expert.publications.map((publication) => (
                  <div key={publication} className="rounded-2xl border border-[var(--ssgi-border)] p-4">
                    <p className="font-semibold">{publication}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle title="Lessons authored" description="Tacit knowledge already captured from this expert" />
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-2xl border border-[var(--ssgi-border)] p-4">
                    <p className="font-semibold">{lesson.projectName}</p>
                    <p className="mt-1 text-sm text-slate-500">{lesson.whatWasLearned}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TaxonomyPage() {
  const { data } = useAppState();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Company-specific taxonomy"
        title="SSGI Taxonomy"
        description="Knowledge is organized by SSGI departments, processes, project types, regions, languages, and knowledge types to support audit, navigation, and reuse."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {data.taxonomy.groups.map((group) => (
          <Card key={group.key}>
            <CardContent>
              <SectionTitle title={group.title} description={group.description} />
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { data } = useAppState();
  const [chartsReady, setChartsReady] = useState(false);
  const documentVolume = getDocumentVolumeByDepartment(data);
  const topTopics = getTopTopics(data);
  const contributors = getMostActiveContributors(data);
  const viewedAssets = getMostViewedAssets(data);
  const gaps = getKnowledgeGaps(data).slice(0, 5);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quality and innovation"
        title="Knowledge Analytics Dashboard"
        description="Monitor repository coverage, contributor activity, most searched topics, and low-coverage areas that may require targeted innovation or knowledge capture."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Approved documents" value={data.documents.filter((item) => item.status === "Approved").length} helper="Quality-controlled explicit assets" icon={FileCheck2} />
        <MetricCard label="Lessons submitted" value={data.lessons.length} helper="Operational learning captured" icon={Sparkles} />
        <MetricCard label="Open discussions" value={data.discussions.filter((item) => item.status === "Open").length} helper="Questions awaiting more insight" icon={CircleAlert} />
        <MetricCard label="Multilingual labels" value="EN + AM" helper="Localized demo experience" icon={Languages} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent>
            <SectionTitle title="Documents by department" description="Knowledge volume across SSGI units" />
            <div className="h-80">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={documentVolume}>
                    <XAxis dataKey="department" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="documents" radius={[10, 10, 0, 0]} fill="#0a2540" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl bg-[var(--ssgi-surface-muted)] text-sm text-slate-500">
                  Preparing analytics chart...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Top searched topics" description="Most requested themes in the knowledge repository" />
            <div className="h-80">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topTopics} dataKey="count" nameKey="topic" outerRadius={110} label>
                      {topTopics.map((entry, index) => (
                        <Cell key={entry.topic} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl bg-[var(--ssgi-surface-muted)] text-sm text-slate-500">
                  Preparing analytics chart...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardContent>
            <SectionTitle title="Most active contributors" description="People creating and answering knowledge content" />
            <div className="space-y-3">
              {contributors.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <span className="font-semibold">{item.name}</span>
                  <Badge>{item.count} contributions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Most viewed assets" description="Knowledge items with highest retrieval value" />
            <div className="space-y-3">
              {viewedAssets.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <span className="font-semibold">{item.name}</span>
                  <Badge variant="success">{item.views} views</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionTitle title="Knowledge gaps" description="Low-coverage categories that need attention" />
            <div className="space-y-3">
              {gaps.map((item) => (
                <div key={item.department} className="rounded-2xl border border-[var(--ssgi-border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.department}</span>
                    <Badge variant={item.gapScore > 3 ? "danger" : "warning"}>Gap score {item.gapScore}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.approvedCount} approved docs · {item.lessonCount} lessons learned
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LocalizationStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent>
          <MapPinned className="h-6 w-6 text-[var(--ssgi-blue)]" />
          <p className="mt-3 font-semibold">Regional awareness</p>
          <p className="mt-2 text-sm text-slate-500">Repository metadata and filters reflect Ethiopian operational regions.</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Languages className="h-6 w-6 text-[var(--ssgi-blue)]" />
          <p className="mt-3 font-semibold">Multilingual labels</p>
          <p className="mt-2 text-sm text-slate-500">Key UI terms support English and Amharic for localized demonstrations.</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CheckCircle2 className="h-6 w-6 text-[var(--ssgi-blue)]" />
          <p className="mt-3 font-semibold">Workflow fit</p>
          <p className="mt-2 text-sm text-slate-500">Language, region, and access control are all part of each knowledge submission.</p>
        </CardContent>
      </Card>
    </div>
  );
}
