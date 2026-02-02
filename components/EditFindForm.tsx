"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCardImageUrl } from "@/lib/cloudinary";

const categories = [
  { value: "coins", label: "Coins & Currency" },
  { value: "pottery", label: "Pottery & Ceramics" },
  { value: "tools", label: "Tools & Implements" },
  { value: "jewelry", label: "Jewelry & Accessories" },
  { value: "fossils", label: "Fossils & Bones" },
  { value: "military", label: "Military Items" },
  { value: "other", label: "Other" },
];

interface EditFindFormProps {
  find: {
    id: number;
    title: string;
    description: string;
    location: string;
    category: string;
    images: string[];
  };
}

export default function EditFindForm({ find }: EditFindFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(find.images);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            previews.push(e.target.result as string);
            setNewPreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add existing images that weren't removed
    formData.set("existingImages", JSON.stringify(existingImages));

    try {
      const response = await fetch(`/api/finds/${find.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        router.push(`/find/${find.id}`);
        router.refresh();
      } else if (response.status === 401) {
        router.push(`/login?callbackUrl=/find/${find.id}/edit`);
      } else if (response.status === 403) {
        alert("You don't have permission to edit this find.");
        router.push(`/find/${find.id}`);
      } else {
        alert("Failed to update find. Please try again.");
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={find.title}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
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
          defaultValue={find.description}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
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
          defaultValue={find.location}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
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
          defaultValue={find.category}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Photos
        </label>
        {existingImages.length > 0 ? (
          <div className="flex gap-2 flex-wrap mb-3">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <div className="relative w-24 h-24">
                  <Image
                    src={getCardImageUrl(img)}
                    alt={`Image ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-3">No photos</p>
        )}

        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
          Add More Photos
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

        {newPreviews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {newPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`New preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
