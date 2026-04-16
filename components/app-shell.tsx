"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  MessagesSquare,
  Search,
  Tags,
  Upload,
  Users,
} from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roleLabels, t } from "@/lib/i18n";
import type { Locale, Role } from "@/lib/types";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "dashboard" },
  { href: "/repository", icon: FolderKanban, label: "repository" },
  { href: "/upload", icon: Upload, label: "upload" },
  { href: "/tacit", icon: BookOpen, label: "tacit" },
  { href: "/lessons", icon: Briefcase, label: "lessons" },
  { href: "/discussions", icon: MessagesSquare, label: "discussions" },
  { href: "/experts", icon: Users, label: "experts" },
  { href: "/taxonomy", icon: Tags, label: "taxonomy" },
  { href: "/analytics", icon: BarChart3, label: "analytics" },
];

const roles: Role[] = ["admin", "manager", "expert", "employee", "viewer"];
const locales: Locale[] = ["en", "am"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, role, setLocale, setRole, resetDemo } = useAppState();

  return (
    <div className="min-h-screen bg-[var(--ssgi-surface)] text-[var(--ssgi-ink)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,#102f54_0%,#143c6a_48%,#1b4d8c_100%)] px-5 py-6 text-white lg:block">
          <div className="mb-8 rounded-3xl border border-white/12 bg-white/8 p-5 shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ssgi-gold)]">SSGI</p>
            <h1 className="mt-2 text-xl font-bold leading-tight">{t(locale, "appName")}</h1>
            <p className="mt-3 text-sm text-white/70">{t(locale, "tagline")}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-white text-[var(--ssgi-blue)] shadow-[0_14px_30px_rgba(0,0,0,0.14)]"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(locale, item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/8 p-5 text-sm">
            <p className="font-semibold text-[var(--ssgi-gold)]">Demo story</p>
            <ul className="mt-3 space-y-2 text-white/75">
              <li>Search for a satellite mapping procedure.</li>
              <li>Open the related lesson and expert profile.</li>
              <li>Submit a new lesson or question.</li>
              <li>Switch to admin and approve pending content.</li>
            </ul>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--ssgi-border)] glass-panel">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ssgi-blue)]">
                  Ethiopian Space Science and Geospatial Institute
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[var(--ssgi-blue-strong)]">
                  Knowledge continuity, quality, and innovation
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-2xl border border-[var(--ssgi-border)] bg-white/80 px-3 py-2 shadow-sm">
                  <Search className="h-4 w-4 text-[var(--ssgi-blue)]" />
                  <span className="text-sm text-slate-600">Demo-ready local workflow</span>
                </div>

                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as Locale)}
                  className="rounded-2xl border border-[var(--ssgi-border)] bg-white/85 px-3 py-2 text-sm text-[var(--ssgi-ink)] shadow-sm outline-none"
                >
                  {locales.map((value) => (
                    <option key={value} value={value}>
                      {value === "en" ? "English" : "አማርኛ"}
                    </option>
                  ))}
                </select>

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                  className="rounded-2xl border border-[var(--ssgi-border)] bg-white/85 px-3 py-2 text-sm text-[var(--ssgi-ink)] shadow-sm outline-none"
                >
                  {roles.map((value) => (
                    <option key={value} value={value}>
                      {roleLabels[value]}
                    </option>
                  ))}
                </select>

                <Button variant="outline" onClick={resetDemo}>
                  Reset demo data
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            <div className="soft-grid rounded-[28px] p-1">
              {children}
            </div>
          </main>

          <footer className="border-t border-[var(--ssgi-border)] bg-white/80 px-4 py-4 text-sm text-slate-500 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>Built for enterprise SSGI knowledge audit, search, localization, and retention demos.</span>
              <span className="flex items-center gap-2">
                <Globe2 className="h-4 w-4" />
                Ethiopia-aware taxonomy, multilingual labels, and regional filters enabled.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
