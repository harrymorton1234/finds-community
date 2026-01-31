import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import FindForm from "@/components/FindForm";

export default async function NewFindPage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/find/new");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Post Your Find
        </h1>
        <p className="text-gray-600 mb-6">
          Share your discovery with the community and get help identifying it
        </p>
        <FindForm />
      </div>
    </div>
  );
}
