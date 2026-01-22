"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AnswerFormProps {
  findId: number;
}

export default function AnswerForm({ findId }: AnswerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      content: formData.get("content"),
      authorName: formData.get("authorName"),
      verdict: formData.get("verdict") || null,
      findId,
    };

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        router.refresh();
      } else {
        alert("Failed to submit answer. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Add Your Answer</h3>

      <div className="space-y-4">
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
            placeholder="Your display name"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Your Answer
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            placeholder="Share what you think this might be, its potential value, historical significance..."
          />
        </div>

        <div>
          <label htmlFor="verdict" className="block text-sm font-medium text-gray-700 mb-1">
            Your Recommendation (optional)
          </label>
          <select
            id="verdict"
            name="verdict"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">No recommendation</option>
            <option value="keep">Keep it - it has personal/sentimental value</option>
            <option value="donate">Donate to museum - historically significant</option>
            <option value="sell">Sell it - has monetary value</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </form>
  );
}
