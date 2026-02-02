import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import ApiKeyManager from "@/components/ApiKeyManager";

export default async function ApiKeysPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/api-keys");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "moderator") {
    redirect("/");
  }

  const apiKeys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const initialKeys = apiKeys.map((key) => ({
    id: key.id,
    name: key.name,
    keyPreview: `${key.key.slice(0, 8)}...${key.key.slice(-8)}`,
    isActive: key.isActive,
    createdAt: key.createdAt.toISOString(),
    lastUsedAt: key.lastUsedAt?.toISOString() || null,
    createdBy: key.createdBy,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">API Key Management</h1>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Bot API Keys
        </h2>
        <p className="text-gray-700 mb-6">
          Generate and manage API keys for bots and automated tools to upload finds.
          Keys are shown in full only once when created - make sure to copy them!
        </p>

        <ApiKeyManager initialKeys={initialKeys} />
      </section>
    </div>
  );
}
