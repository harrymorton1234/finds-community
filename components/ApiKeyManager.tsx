"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ApiKeyManagerProps {
  initialKeys: ApiKey[];
}

export default function ApiKeyManager({ initialKeys }: ApiKeyManagerProps) {
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createKey = async () => {
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewlyCreatedKey(data.key);
        setNewKeyName("");
        router.refresh();
        // Add to local state
        setKeys([
          {
            id: data.id,
            name: data.name,
            keyPreview: `${data.key.slice(0, 8)}...${data.key.slice(-8)}`,
            isActive: true,
            createdAt: data.createdAt,
            lastUsedAt: null,
            createdBy: { id: "", name: "You", email: "" },
          },
          ...keys,
        ]);
      } else {
        alert("Failed to create API key");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleKey = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setKeys(
          keys.map((key) =>
            key.id === id ? { ...key, isActive: !currentStatus } : key
          )
        );
      }
    } catch {
      alert("Failed to update key");
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setKeys(keys.filter((key) => key.id !== id));
      }
    } catch {
      alert("Failed to delete key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Create new key */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Create New API Key</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g., Dad's Bot)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            onClick={createKey}
            disabled={isCreating || !newKeyName.trim()}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create Key"}
          </button>
        </div>
      </div>

      {/* Show newly created key */}
      {newlyCreatedKey && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            New API Key Created!
          </h3>
          <p className="text-sm text-green-700 mb-3">
            Copy this key now - it won't be shown again!
          </p>
          <div className="flex gap-2">
            <code className="flex-1 p-3 bg-white border rounded font-mono text-sm break-all">
              {newlyCreatedKey}
            </code>
            <button
              onClick={() => copyToClipboard(newlyCreatedKey)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setNewlyCreatedKey(null)}
            className="mt-3 text-sm text-green-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* List existing keys */}
      <div className="space-y-4">
        {keys.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No API keys created yet
          </p>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className={`p-4 border rounded-lg ${
                key.isActive
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{key.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        key.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {key.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <code className="text-sm text-gray-500 font-mono">
                    {key.keyPreview}
                  </code>
                  <div className="text-xs text-gray-400 mt-1">
                    Created:{" "}
                    {new Date(key.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {key.lastUsedAt && (
                      <>
                        {" "}| Last used:{" "}
                        {new Date(key.lastUsedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleKey(key.id, key.isActive)}
                    className={`text-xs px-3 py-1 rounded ${
                      key.isActive
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {key.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
