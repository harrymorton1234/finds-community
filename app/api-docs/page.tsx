export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">API Documentation</h1>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Finds API allows bots and automated tools to create finds
          programmatically. This API uses JSON format and API key
          authentication.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Authentication
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All API requests require authentication using a Bearer token in the
          Authorization header.
        </p>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
          {`Authorization: Bearer YOUR_API_KEY`}
        </pre>
        <p className="text-gray-600 mt-4 text-sm">
          Contact the site administrator to request an API key.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Create a Find
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Endpoint</h3>
          <code className="bg-amber-100 px-3 py-1 rounded text-amber-900">
            POST /api/bot/finds
          </code>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Request Headers</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`Content-Type: application/json
Authorization: Bearer YOUR_API_KEY`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Request Body</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`{
  "title": "Roman coin found in garden",
  "description": "Small bronze coin with portrait on one side...",
  "location": "Near Brighton, UK",
  "category": "coins",
  "images": [
    "https://example.com/photo.jpg",
    "data:image/jpeg;base64,/9j/4AAQSkZ...",
    "/9j/4AAQSkZJRgABAQ..."
  ],
  "botUserId": "optional-user-id"
}`}
          </pre>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-800 mb-2">Image Formats</h3>
          <p className="text-sm text-amber-900 mb-2">Images can be provided in three formats:</p>
          <ul className="text-sm text-amber-900 list-disc list-inside space-y-1">
            <li><strong>URL</strong>: <code>https://example.com/image.jpg</code></li>
            <li><strong>Data URI</strong>: <code>data:image/jpeg;base64,/9j/4AA...</code></li>
            <li><strong>Raw base64</strong>: <code>/9j/4AAQSkZJRg...</code> (JPEG/PNG auto-detected)</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Fields</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Field</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Required</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2 font-mono">title</td>
                  <td className="px-4 py-2">string</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Title of the find (min 3 chars)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">description</td>
                  <td className="px-4 py-2">string</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">
                    Detailed description (min 10 chars)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">location</td>
                  <td className="px-4 py-2">string</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Where the item was found</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">category</td>
                  <td className="px-4 py-2">string</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">
                    One of: coins, pottery, tools, jewelry, fossils, military,
                    other
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">images</td>
                  <td className="px-4 py-2">string[]</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">
                    Array of image URLs or base64 (max 10, max 10MB each)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">botUserId</td>
                  <td className="px-4 py-2">string</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">
                    User ID to associate the find with
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Success Response (201)
          </h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`{
  "success": true,
  "find": {
    "id": 123,
    "title": "Roman coin found in garden",
    "description": "Small bronze coin with portrait on one side...",
    "location": "Near Brighton, UK",
    "category": "coins",
    "images": ["https://res.cloudinary.com/..."],
    "createdAt": "2026-02-02T12:00:00.000Z",
    "user": null
  }
}`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Error Responses</h3>
          <div className="space-y-3">
            <div>
              <span className="font-mono text-red-600">401 Unauthorized</span>
              <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                {`{"error": "Unauthorized", "message": "Invalid or missing API key"}`}
              </pre>
            </div>
            <div>
              <span className="font-mono text-red-600">400 Bad Request</span>
              <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                {`{"error": "Validation error", "message": "Title is required..."}`}
              </pre>
            </div>
            <div>
              <span className="font-mono text-red-600">
                429 Too Many Requests
              </span>
              <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                {`{"error": "Rate limit exceeded", "message": "Too many requests..."}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Get a Find
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Endpoint</h3>
          <code className="bg-amber-100 px-3 py-1 rounded text-amber-900">
            GET /api/bot/finds/:id
          </code>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Success Response (200)
          </h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`{
  "id": 123,
  "title": "Roman coin found in garden",
  "description": "Small bronze coin...",
  "location": "Near Brighton, UK",
  "category": "coins",
  "images": ["https://res.cloudinary.com/..."],
  "createdAt": "2026-02-02T12:00:00.000Z",
  "user": null,
  "answerCount": 5
}`}
          </pre>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Delete a Find
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Endpoint</h3>
          <code className="bg-red-100 px-3 py-1 rounded text-red-900">
            DELETE /api/bot/finds/:id
          </code>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Example</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`curl -X DELETE https://your-domain.com/api/bot/finds/123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Success Response (200)
          </h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`{
  "success": true,
  "message": "Find 123 deleted successfully"
}`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Error Responses</h3>
          <div className="space-y-3">
            <div>
              <span className="font-mono text-red-600">404 Not Found</span>
              <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                {`{"error": "Not found", "message": "Find not found"}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Example Usage
        </h2>

        <h3 className="font-semibold text-gray-900 mb-2">cURL</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-6">
          {`curl -X POST https://your-domain.com/api/bot/finds \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "title": "Roman coin",
    "description": "Bronze coin found while gardening",
    "location": "Brighton, UK",
    "category": "coins"
  }'`}
        </pre>

        <h3 className="font-semibold text-gray-900 mb-2">Python</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-6">
          {`import requests
import base64

# Read image and convert to base64
with open("coin.jpg", "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode()

response = requests.post(
    "https://your-domain.com/api/bot/finds",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    },
    json={
        "title": "Roman coin",
        "description": "Bronze coin found while gardening",
        "location": "Brighton, UK",
        "category": "coins",
        "images": [f"data:image/jpeg;base64,{image_base64}"]
    }
)
print(response.json())`}
        </pre>

        <h3 className="font-semibold text-gray-900 mb-2">JavaScript/Node.js</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
          {`const fs = require('fs');

const imageBuffer = fs.readFileSync('coin.jpg');
const imageBase64 = imageBuffer.toString('base64');

const response = await fetch('https://your-domain.com/api/bot/finds', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    title: 'Roman coin',
    description: 'Bronze coin found while gardening',
    location: 'Brighton, UK',
    category: 'coins',
    images: [\`data:image/jpeg;base64,\${imageBase64}\`]
  })
});

const data = await response.json();
console.log(data);`}
        </pre>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Rate Limits
        </h2>
        <p className="text-gray-700 leading-relaxed">
          API requests are limited to <strong>100 requests per hour</strong> per
          API key. If you exceed this limit, you will receive a 429 response.
        </p>
      </section>
    </div>
  );
}
