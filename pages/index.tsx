import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { BookOpen, Target, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamic imports for motion components to prevent SSR issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
)

const MotionButton = dynamic(
  () => import('framer-motion').then(mod => mod.motion.button),
  { ssr: false }
)

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
                Master Your <span className="text-primary-600">NBHWC Certification</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive, gamified study platform designed to help you achieve near-100% pass rates 
                through adaptive learning and interactive content.
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
        {/* Hero Section */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Master Your <span className="text-primary-600">NBHWC Certification</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive, gamified study platform designed to help you achieve near-100% pass rates 
              through adaptive learning and interactive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <MotionButton 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
                >
                  Start Studying Now
                </MotionButton>
              </Link>
              <Link href="/assessment">
                <MotionButton 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors"
                >
                  Take Diagnostic Test
                </MotionButton>
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
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </MotionDiv>
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
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-full h-2 ${domain.color} rounded-full mb-4`}></div>
                    <h3 className="font-semibold text-lg mb-2">{domain.name}</h3>
                    <p className="text-gray-600">{domain.weight} of exam</p>
                  </MotionDiv>
                </Link>
              ))}
            </div>
          </div>
        </MotionDiv>
      </div>
    </Layout>
  )
}
