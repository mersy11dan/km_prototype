import type { Locale, Role } from "@/lib/types";

export const localeLabels: Record<Locale, Record<string, string>> = {
  en: {
    appName: "SSGI Knowledge Management System",
    tagline: "Enterprise knowledge platform for the Ethiopian Space Science and Geospatial Institute",
    dashboard: "Dashboard",
    repository: "Repository",
    tacit: "Tacit Knowledge",
    lessons: "Lessons Learned",
    discussions: "Discussions",
    experts: "Expert Directory",
    taxonomy: "Taxonomy",
    analytics: "Analytics",
    upload: "Upload Knowledge",
    search: "Search",
    role: "Role",
    language: "Language",
    recentUploads: "Recent uploads",
    quickActions: "Quick actions",
    approvedContent: "Approved content",
    pendingReview: "Pending review",
    viewTaxonomy: "View taxonomy",
    findExpert: "Find expert",
    addLesson: "Add lesson learned",
    askQuestion: "Ask knowledge question",
    adminReview: "Admin review",
  },
  am: {
    appName: "የኤስኤስጂአይ የእውቀት አስተዳደር ስርዓት",
    tagline: "ለኢትዮጵያ የስፔስ ሳይንስ እና ጂኦስፓሻል ኢንስቲትዩት የድርጅት የእውቀት መድረክ",
    dashboard: "ዳሽቦርድ",
    repository: "ማከማቻ",
    tacit: "Tacit እውቀት",
    lessons: "የተማሩ ትምህርቶች",
    discussions: "ውይይቶች",
    experts: "የባለሙያ ማውጫ",
    taxonomy: "ታክሶኖሚ",
    analytics: "ትንታኔ",
    upload: "እውቀት ጫን",
    search: "ፈልግ",
    role: "ሚና",
    language: "ቋንቋ",
    recentUploads: "የቅርብ ጊዜ ጭነቶች",
    quickActions: "ፈጣን እርምጃዎች",
    approvedContent: "የፀደቀ ይዘት",
    pendingReview: "በግምገማ ላይ",
    viewTaxonomy: "ታክሶኖሚ ይመልከቱ",
    findExpert: "ባለሙያ ይፈልጉ",
    addLesson: "ትምህርት ያክሉ",
    askQuestion: "የእውቀት ጥያቄ ይጠይቁ",
    adminReview: "የአስተዳዳሪ ግምገማ",
  },
};

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  expert: "Expert",
  employee: "Employee",
  viewer: "Viewer",
};

export function t(locale: Locale, key: string) {
  return localeLabels[locale][key] ?? localeLabels.en[key] ?? key;
}
