import SignupForm from "@/components/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>
        <SignupForm />
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
