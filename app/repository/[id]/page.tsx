import { DocumentDetailPage } from "@/components/kms-pages";

export default async function RepositoryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DocumentDetailPage id={id} />;
}
