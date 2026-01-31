"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-amber-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏺</span>
            <span className="font-bold text-xl">Finds</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hover:bg-amber-700 px-3 py-2 rounded transition"
            >
              Browse Finds
            </Link>
            <Link
              href="/about"
              className="hover:bg-amber-700 px-3 py-2 rounded transition"
            >
              About
            </Link>
            <Link
              href="/find/new"
              className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded font-medium transition"
            >
              Post a Find
            </Link>

            {status === "loading" ? (
              <span className="text-amber-200 px-3 py-2">...</span>
            ) : session ? (
              <>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-amber-200">
                    {session.user?.name || session.user?.email}
                  </span>
                  {session.user?.role === "moderator" && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">
                      Moderator
                    </span>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="hover:bg-amber-700 px-3 py-2 rounded transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:bg-amber-700 px-3 py-2 rounded transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-amber-800 hover:bg-gray-100 px-3 py-2 rounded font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
