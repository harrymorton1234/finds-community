import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getDetailImageUrl } from "@/lib/cloudinary";
import AnswerForm from "@/components/AnswerForm";
import DeleteButton from "@/components/DeleteButton";

interface FindPageProps {
  params: Promise<{ id: string }>;
}

const verdictLabels: Record<string, { text: string; color: string }> = {
  keep: { text: "Keep it", color: "bg-blue-100 text-blue-800" },
  donate: { text: "Donate to museum", color: "bg-green-100 text-green-800" },
  sell: { text: "Sell it", color: "bg-yellow-100 text-yellow-800" },
  throw: { text: "Throw it away", color: "bg-red-100 text-red-800" },
};

const categoryLabels: Record<string, string> = {
  coins: "Coins & Currency",
  pottery: "Pottery & Ceramics",
  tools: "Tools & Implements",
  jewelry: "Jewelry & Accessories",
  fossils: "Fossils & Bones",
  military: "Military Items",
  other: "Other",
};

async function getFind(id: number) {
  const find = await prisma.find.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
      answers: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
    },
  });
  return find;
}

export default async function FindPage({ params }: FindPageProps) {
  const { id } = await params;
  const [find, session] = await Promise.all([
    getFind(parseInt(id)),
    auth(),
  ]);

  if (!find) {
    notFound();
  }

  const images = JSON.parse(find.images) as string[];
  const findAuthor =
    find.authorName || find.user?.name || find.user?.email || "Anonymous";
  const isAuthorModerator = !find.authorName && find.user?.role === "moderator";
  const isAuthorDev = !find.authorName && find.user?.role === "dev";

  // Check if current user is owner or moderator
  let isModerator = false;
  let isOwner = false;
  if (session?.user?.id) {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    isModerator = currentUser?.role === "moderator";
    isOwner = find.userId === session.user.id;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Images */}
        {images.length > 0 && (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={getDetailImageUrl(img)}
                    alt={`${find.title} - Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Find Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded">
                {categoryLabels[find.category] || find.category}
              </span>
              <span className="text-gray-500 text-sm">
                Posted by {findAuthor}
                {isAuthorModerator && (
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                    Moderator
                  </span>
                )}
                {isAuthorDev && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                    Dev
                  </span>
                )}
              </span>
            </div>
            {(isOwner || isModerator) && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/find/${find.id}/edit`}
                  className="text-xs text-amber-600 hover:text-amber-800 hover:underline"
                >
                  Edit
                </Link>
                <DeleteButton type="find" id={find.id} />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{find.title}</h1>

          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4">Found at: {find.location}</span>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {find.description}
            </p>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Community Answers ({find.answers.length})
        </h2>

        {/* Answer Form */}
        <div className="mb-6">
          <AnswerForm findId={find.id} />
        </div>

        {/* Existing Answers */}
        {find.answers.length > 0 ? (
          <div className="space-y-4">
            {find.answers.map((answer) => {
              const answerAuthor =
                answer.authorName ||
                answer.user?.name ||
                answer.user?.email ||
                "Anonymous";
              const isAnswerAuthorModerator = !answer.authorName && answer.user?.role === "moderator";
              const isAnswerAuthorDev = !answer.authorName && answer.user?.role === "dev";

              return (
                <div
                  key={answer.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {answerAuthor}
                      </span>
                      {isAnswerAuthorModerator && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                          Moderator
                        </span>
                      )}
                      {isAnswerAuthorDev && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          Dev
                        </span>
                      )}
                      {answer.verdict && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            verdictLabels[answer.verdict]?.color || "bg-gray-100"
                          }`}
                        >
                          {verdictLabels[answer.verdict]?.text || answer.verdict}
                        </span>
                      )}
                    </div>
                    {isModerator && (
                      <DeleteButton type="answer" id={answer.id} />
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {answer.content}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(answer.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No answers yet. Be the first to help identify this find!
          </div>
        )}
      </div>
    </div>
  );
}
