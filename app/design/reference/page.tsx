import Home from '../../page'

export default function DesignReferencePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Note at the top */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 font-medium">
            Goal: match the reference image above.
          </p>
        </div>

        {/* Reference image */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reference Design</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <img
                  src="/concepts/dabble-landing-concept.png"
                  alt="Dabble landing page design concept"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current implementation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current implementation</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Home />
          </div>
        </div>
      </div>
    </div>
  )
}

