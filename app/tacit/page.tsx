import { LocalizationStrip, TacitKnowledgePage } from "@/components/kms-pages";

export default function TacitRoute() {
  return (
    <div className="space-y-6">
      <TacitKnowledgePage />
      <LocalizationStrip />
    </div>
  );
}
