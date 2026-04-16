import { ExpertDetailPage } from "@/components/kms-pages";

export default async function ExpertDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ExpertDetailPage id={id} />;
}
