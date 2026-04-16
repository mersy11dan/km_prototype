import { RepositoryPage } from "@/components/kms-pages";

export default async function RepositoryRoute({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = (await searchParams) ?? {};

  return <RepositoryPage initialQuery={params.q ?? ""} />;
}
