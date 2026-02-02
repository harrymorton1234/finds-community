import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import EditFindForm from "@/components/EditFindForm";

interface EditFindPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFindPage({ params }: EditFindPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/find/${id}/edit`);
  }

  const find = await prisma.find.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      category: true,
      images: true,
      userId: true,
    },
  });

  if (!find) {
    notFound();
  }

  // Only the owner can edit
  if (find.userId !== session.user.id) {
    redirect(`/find/${id}`);
  }

  const images = JSON.parse(find.images) as string[];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Find</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <EditFindForm
          find={{
            id: find.id,
            title: find.title,
            description: find.description,
            location: find.location,
            category: find.category,
            images,
          }}
        />
      </div>
    </div>
  );
}
