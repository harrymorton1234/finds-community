"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { value: "coins", label: "Coins & Currency" },
  { value: "pottery", label: "Pottery & Ceramics" },
  { value: "tools", label: "Tools & Implements" },
  { value: "jewelry", label: "Jewelry & Accessories" },
  { value: "fossils", label: "Fossils & Bones" },
  { value: "military", label: "Military Items" },
  { value: "other", label: "Other" },
];

export default function FindForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            setPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/finds", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const find = await response.json();
        router.push(`/find/${find.id}`);
      } else {
        alert("Failed to submit find. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="authorName"
          name="authorName"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder="Enter your display name"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder="e.g., Strange coin found in garden"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder="Describe what you found, its condition, any markings or inscriptions..."
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Where did you find it?
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder="e.g., Beach near Brighton, UK"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
          Photos
        </label>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
        />
        <p className="text-xs text-gray-500 mt-1">Upload clear photos from multiple angles if possible</p>

        {previews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? "Posting..." : "Post Your Find"}
      </button>
    </form>
  );
}
