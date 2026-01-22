"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { value: "all", label: "All Finds" },
  { value: "coins", label: "Coins" },
  { value: "pottery", label: "Pottery" },
  { value: "tools", label: "Tools" },
  { value: "jewelry", label: "Jewelry" },
  { value: "fossils", label: "Fossils" },
  { value: "military", label: "Military" },
  { value: "other", label: "Other" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleChange = (category: string) => {
    if (category === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${category}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleChange(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            currentCategory === cat.value
              ? "bg-amber-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
