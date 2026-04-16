import { LocalizationStrip, TaxonomyPage } from "@/components/kms-pages";

export default function TaxonomyRoute() {
  return (
    <div className="space-y-6">
      <TaxonomyPage />
      <LocalizationStrip />
    </div>
  );
}
