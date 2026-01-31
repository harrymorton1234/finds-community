import { Suspense } from "react";
import FindCard from "@/components/FindCard";
import CategoryFilter from "@/components/CategoryFilter";
import { prisma } from "@/lib/db";

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

async function getFinds(category?: string) {
  const finds = await prisma.find.findMany({
    where: category && category !== "all" ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { answers: true },
      },
    },
  });
  return finds;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const finds = await getFinds(params.category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finds</h1>
        <p className="text-gray-600 mb-6">
          Share your discoveries and help others identify theirs
        </p>
        <Suspense fallback={<div>Loading filters...</div>}>
          <CategoryFilter />
        </Suspense>
      </div>

      {finds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">No finds yet!</p>
          <p className="text-gray-400">Be the first to post a discovery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finds.map((find) => (
            <FindCard
              key={find.id}
              id={find.id}
              title={find.title}
              description={find.description}
              location={find.location}
              category={find.category}
              authorName={find.authorName}
              user={find.user}
              images={find.images}
              createdAt={find.createdAt.toISOString()}
              _count={find._count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
