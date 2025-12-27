'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SkillCategory, SkillLevel, UserRole } from '@prisma/client'
import CategoryMultiSelect from '../components/CategoryMultiSelect'
import SkillSelector from '../components/SkillSelector'

interface Skill {
  id: string
  name: string
  category: SkillCategory
}

interface SelectedSkill {
  skillId: string
  level: SkillLevel
}

const allCategories: SkillCategory[] = ['Adventure', 'HomeImprovement', 'Creative']

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Basic contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Location
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [radiusMiles, setRadiusMiles] = useState(10)

  // Account
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Role
  const [role, setRole] = useState<UserRole>('Dabbler')

  // Interests and abilities
  const [dabblerCategories, setDabblerCategories] = useState<SkillCategory[]>([])
  const [guideCategories, setGuideCategories] = useState<SkillCategory[]>([])
  const [dabblerSkills, setDabblerSkills] = useState<SelectedSkill[]>([])
  const [guideSkills, setGuideSkills] = useState<SelectedSkill[]>([])

  // Skills data - will be loaded from API
  const [skills, setSkills] = useState<Skill[]>([])

  // Load skills on mount
  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch(() => {})
  }, [])

  const handleDabblerSkillChange = (skillId: string, level: SkillLevel | null) => {
    if (level === null) {
      setDabblerSkills(dabblerSkills.filter((s) => s.skillId !== skillId))
    } else {
      const existing = dabblerSkills.findIndex((s) => s.skillId === skillId)
      if (existing >= 0) {
        const updated = [...dabblerSkills]
        updated[existing].level = level
        setDabblerSkills(updated)
      } else {
        setDabblerSkills([...dabblerSkills, { skillId, level }])
      }
    }
  }

  const handleGuideSkillChange = (skillId: string, level: SkillLevel | null) => {
    if (level === null) {
      setGuideSkills(guideSkills.filter((s) => s.skillId !== skillId))
    } else {
      const existing = guideSkills.findIndex((s) => s.skillId === skillId)
      if (existing >= 0) {
        const updated = [...guideSkills]
        updated[existing].level = level
        setGuideSkills(updated)
      } else {
        setGuideSkills([...guideSkills, { skillId, level }])
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!name || !email || !username || !city || !state) {
      setError('Please fill in all required fields')
      return
    }

    if ((role === 'Dabbler' || role === 'Both') && dabblerSkills.length === 0) {
      setError('Please select at least one dabbling interest')
      return
    }

    if ((role === 'Guide' || role === 'Both') && guideSkills.length === 0) {
      setError('Please select at least one guide ability')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          username,
          password,
          city,
          state,
          zip: zip || undefined,
          radiusMiles,
          role,
          dabblerSkills: dabblerSkills.map((s) => ({ skillId: s.skillId, level: s.level })),
          guideSkills: guideSkills.map((s) => ({ skillId: s.skillId, level: s.level })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/try')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#faf8f5] relative">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
          <Link href="/" className="text-3xl font-bold text-[#2d5016] hand-drawn">
            Dabble
          </Link>
        </nav>

        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
            <p className="text-gray-600">Your account has been created. Redirecting...</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] relative">
      {/* Paper texture background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <Link href="/" className="text-3xl font-bold text-[#2d5016] hand-drawn">
          Dabble
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-[#2d5016] transition text-lg">
            Sign In
          </Link>
          <Link href="/signup" className="text-gray-700 hover:text-[#2d5016] transition text-lg font-medium">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center hand-drawn">
            Join Dabble
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-gray-200 space-y-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Contact */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Basic Information
              </h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Location
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP (optional)
                  </label>
                  <input
                    type="text"
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
                  Willing to travel radius: {radiusMiles} miles
                </label>
                <input
                  type="range"
                  id="radius"
                  min="5"
                  max="100"
                  step="5"
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 mi</span>
                  <span>100 mi</span>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Account
              </h2>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016] bg-white"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                I want to be a...
              </h2>
              <div className="flex flex-wrap gap-4">
                {(['Dabbler', 'Guide', 'Both'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all ${
                      role === r
                        ? 'border-[#2d5016] bg-[#a8d5a3] bg-opacity-30 text-[#2d5016] font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#2d5016] hover:bg-[#a8d5a3] hover:bg-opacity-10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Dabbling Interests */}
            {(role === 'Dabbler' || role === 'Both') && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                  What do you want to learn?
                </h2>
                <CategoryMultiSelect
                  categories={allCategories}
                  selectedCategories={dabblerCategories}
                  onChange={setDabblerCategories}
                  label="Select categories you're interested in:"
                />
                {dabblerCategories.map((category) => (
                  <SkillSelector
                    key={`dabbler-${category}`}
                    skills={skills}
                    selectedSkills={dabblerSkills}
                    onChange={handleDabblerSkillChange}
                    category={category}
                    label={`Select ${category} skills you want to learn:`}
                  />
                ))}
              </div>
            )}

            {/* Guide Abilities */}
            {(role === 'Guide' || role === 'Both') && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                  What can you teach?
                </h2>
                <CategoryMultiSelect
                  categories={allCategories}
                  selectedCategories={guideCategories}
                  onChange={setGuideCategories}
                  label="Select categories you can teach:"
                />
                {guideCategories.map((category) => (
                  <SkillSelector
                    key={`guide-${category}`}
                    skills={skills}
                    selectedSkills={guideSkills}
                    onChange={handleGuideSkillChange}
                    category={category}
                    label={`Select ${category} skills you can teach:`}
                  />
                ))}
              </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#a8d5a3] border-2 border-[#2d5016] text-[#2d5016] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#95c590] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

