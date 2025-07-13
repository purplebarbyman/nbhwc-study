import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { BookOpen, Target, Trophy, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Master Your <span className="text-blue-600">NBHWC Certification</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Loading your comprehensive study platform...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Master Your <span className="text-blue-600">NBHWC Certification</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive, gamified study platform designed to help you achieve near-100% pass rates 
              through adaptive learning and interactive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                  Start Studying Now
                </button>
              </Link>
              <Link href="/assessment">
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
                  Take Diagnostic Test
                </button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: BookOpen, title: "2000+ Questions", desc: "Comprehensive question bank across all domains" },
              { icon: Target, title: "Adaptive Learning", desc: "AI-powered personalized study paths" },
              { icon: Trophy, title: "Gamified Experience", desc: "Earn points, badges, and track streaks" },
              { icon: Users, title: "Expert Reviewed", desc: "Content validated by certified NBHWC coaches" }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Study Domains */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8">Study Domains</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Coaching Structure", weight: "15%", color: "bg-blue-500" },
                { name: "Coaching Process", weight: "48%", color: "bg-green-500" },
                { name: "Health & Wellness", weight: "23%", color: "bg-purple-500" },
                { name: "Ethics & Legal", weight: "14%", color: "bg-orange-500" }
              ].map((domain, index) => (
                <Link key={index} href={`/study/${domain.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="cursor-pointer p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`w-full h-2 ${domain.color} rounded-full mb-4`}></div>
                    <h3 className="font-semibold text-lg mb-2">{domain.name}</h3>
                    <p className="text-gray-600">{domain.weight} of exam</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
