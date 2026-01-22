import Link from "next/link";
import Image from "next/image";

interface FindCardProps {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  authorName: string;
  images: string;
  createdAt: string;
  _count: {
    answers: number;
  };
}

const categoryColors: Record<string, string> = {
  coins: "bg-yellow-100 text-yellow-800",
  pottery: "bg-orange-100 text-orange-800",
  tools: "bg-gray-100 text-gray-800",
  jewelry: "bg-pink-100 text-pink-800",
  fossils: "bg-green-100 text-green-800",
  military: "bg-red-100 text-red-800",
  other: "bg-blue-100 text-blue-800",
};

export default function FindCard({ id, title, description, location, category, authorName, images, createdAt, _count }: FindCardProps) {
  const imageArray = JSON.parse(images) as string[];
  const firstImage = imageArray[0];

  return (
    <Link href={`/find/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-4xl">📷</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs px-2 py-1 rounded ${categoryColors[category] || categoryColors.other}`}>
              {category}
            </span>
            <span className="text-xs text-gray-500">
              {_count.answers} {_count.answers === 1 ? "answer" : "answers"}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>📍 {location}</span>
            <span>by {authorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
