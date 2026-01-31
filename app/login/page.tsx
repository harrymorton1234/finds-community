import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>
        <LoginForm />
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-amber-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
