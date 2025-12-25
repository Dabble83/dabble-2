import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-600">Dabble</div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Learn Anything,<br />
          <span className="text-primary-600">From Anyone</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with local teachers and learn new skills, sports, and hobbies. 
          Whether you want to learn guitar, coding, cooking, or tennis, find the perfect instructor nearby.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/signup?type=learner"
            className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
          >
            Find a Teacher
          </Link>
          <Link 
            href="/signup?type=teacher"
            className="bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition shadow-lg hover:shadow-xl"
          >
            Become a Teacher
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How Dabble Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Find Local Teachers</h3>
            <p className="text-gray-600">
              Search for instructors in your area teaching the skills you want to learn.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Connect & Chat</h3>
            <p className="text-gray-600">
              Message teachers directly, discuss your goals, and schedule lessons.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Start Learning</h3>
            <p className="text-gray-600">
              Meet up and begin your learning journey with personalized instruction.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Popular Skills to Learn
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {['Guitar', 'Coding', 'Cooking', 'Tennis', 'Photography', 'Spanish', 'Yoga', 'Chess'].map((skill) => (
            <div 
              key={skill}
              className="bg-white p-6 rounded-xl text-center font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition cursor-pointer shadow-md hover:shadow-lg"
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary-600 text-white rounded-3xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners and teachers on Dabble today.
          </p>
          <Link 
            href="/signup"
            className="bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold text-primary-600">Dabble</div>
          <div className="flex gap-6 text-gray-600">
            <Link href="/about" className="hover:text-primary-600 transition">About</Link>
            <Link href="/how-it-works" className="hover:text-primary-600 transition">How It Works</Link>
            <Link href="/contact" className="hover:text-primary-600 transition">Contact</Link>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8">
          © 2024 Dabble. All rights reserved.
        </div>
      </footer>
    </main>
  )
}

