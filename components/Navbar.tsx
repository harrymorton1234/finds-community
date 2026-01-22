"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-amber-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏺</span>
            <span className="font-bold text-xl">FindsID</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hover:bg-amber-700 px-3 py-2 rounded transition"
            >
              Browse Finds
            </Link>
            <Link
              href="/find/new"
              className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded font-medium transition"
            >
              Post a Find
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
