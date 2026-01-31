"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  type: "find" | "answer";
  id: number;
  onDelete?: () => void;
}

export default function DeleteButton({ type, id, onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const endpoint = type === "find" ? `/api/finds/${id}` : `/api/answers/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        if (type === "find") {
          router.push("/");
        } else {
          router.refresh();
          onDelete?.();
        }
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Delete this {type}?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-xs text-red-600 hover:text-red-800 hover:underline"
    >
      Delete
    </button>
  );
}
