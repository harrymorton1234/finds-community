export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Finds</h1>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Finds is a community-driven platform dedicated to helping people
          identify and learn about archaeological discoveries. Whether you've
          found an intriguing artifact in your garden, stumbled upon something
          interesting while metal detecting, or discovered a curious object at a
          car boot sale, our community is here to help.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We believe that every find tells a story, and understanding these
          stories connects us to our shared history. Our goal is to make
          archaeological knowledge accessible to everyone, not just academics
          and professionals.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          Community Impact
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our community brings together hobbyists, historians, archaeologists,
          and curious minds from all walks of life. Together, we can discover
          thousands of finds, from Roman coins to medieval artifacts,
          Victorian curiosities to prehistoric tools.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-3xl font-bold text-amber-800">Connect</div>
            <p className="text-gray-600 mt-2">
              Bringing together finders and experts
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-3xl font-bold text-amber-800">Learn</div>
            <p className="text-gray-600 mt-2">
              Sharing knowledge about history and heritage
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-3xl font-bold text-amber-800">Preserve</div>
            <p className="text-gray-600 mt-2">
              Documenting discoveries for future generations
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          How It Works
        </h2>
        <ol className="space-y-4">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold mr-4">
              1
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">Post Your Find</h3>
              <p className="text-gray-600">
                Upload photos of your discovery along with details about where
                and how you found it.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold mr-4">
              2
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">
                Get Community Feedback
              </h3>
              <p className="text-gray-600">
                Our knowledgeable community members will help identify your find
                and share insights about its history.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold mr-4">
              3
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">Learn and Share</h3>
              <p className="text-gray-600">
                Discover the story behind your find and contribute to our
                growing archive of documented discoveries.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="bg-amber-800 text-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p className="leading-relaxed mb-4">
          Whether you're a seasoned detectorist, an armchair archaeologist, or
          just someone who found something interesting, you're welcome here.
          Every discovery matters, and every question deserves an answer.
        </p>
        <p className="text-amber-200">
          Start exploring finds or share your own discovery today.
        </p>
      </section>
    </div>
  );
}
