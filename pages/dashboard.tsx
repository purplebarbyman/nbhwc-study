import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useStudy } from '@/contexts/StudyContext'
import { Trophy, Target, Clock, TrendingUp, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamic imports for motion components to prevent SSR issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
)

export default function Dashboard() {
  const { state } = useStudy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {state.user.name}! 
            </h1>
            <p className="text-gray-600">Ready to continue your NBHWC certification journey?</p>
          </div>
        </div>
      </Layout>
    )
  }

  const totalQuestions = Object.values(state.progress).reduce((sum, domain) => sum + domain.total, 0)
  const completedQuestions = Object.values(state.progress).reduce((sum, domain) => sum + domain.completed, 0)
  const overallProgress = (completedQuestions / totalQuestions) * 100

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {state.user.name}! 
          </h1>
          <p className="text-gray-600">Ready to continue your NBHWC certification journey?</p>
        </MotionDiv>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Trophy, label: "Level", value: state.user.level, color: "text-yellow-600" },
            { icon: Target, label: "Points", value: state.user.points.toLocaleString(), color: "text-blue-600" },
            { icon: Clock, label: "Streak", value: `${state.user.streak} days`, color: "text-green-600" },
            { icon: TrendingUp, label: "Progress", value: `${Math.round(overallProgress)}%`, color: "text-purple-600" }
          ].map((stat, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* Progress Chart Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <MotionDiv 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Domain Progress</h2>
              <div className="space-y-4">
                {Object.entries(state.progress).map(([domain, progress]) => {
                  const domainProgress = (progress.completed / progress.total) * 100
                  const domainNames = {
                    'coaching-structure': 'Coaching Structure',
                    'coaching-process': 'Coaching Process', 
                    'health-wellness': 'Health & Wellness',
                    'ethics-legal': 'Ethics & Legal'
                  }
                  
                  return (
                    <div key={domain} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{domainNames[domain as keyof typeof domainNames]}</span>
                        <span className="text-gray-600">{Math.round(domainProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${domainProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{progress.completed} / {progress.total} questions</span>
                        <span>{Math.round(progress.accuracy)}% accuracy</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </MotionDiv>
          </div>
          
          <div className="space-y-6">
            {/* Study Streak */}
            <MotionDiv 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Study Streak
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {state.user.streak}
                </div>
                <p className="text-gray-600">days in a row</p>
                <div className="mt-4 flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < state.user.streak % 7 ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </MotionDiv>
            
            {/* Badges */}
            <MotionDiv 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Recent Badges
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {state.user.badges.slice(-6).map((badge, index) => (
                  <div key={index} className="bg-yellow-100 p-2 rounded-lg text-center">
                    <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-xs text-yellow-800">{badge}</p>
                  </div>
                ))}
                {state.user.badges.length === 0 && (
                  <div className="col-span-3 text-center text-gray-500 py-4">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Start studying to earn badges!</p>
                  </div>
                )}
              </div>
            </MotionDiv>
          </div>
        </div>

        {/* Study Domains */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Continue Studying</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(state.progress).map(([domain, progress]) => {
              const domainProgress = (progress.completed / progress.total) * 100
              const domainNames = {
                'coaching-structure': 'Coaching Structure',
                'coaching-process': 'Coaching Process', 
                'health-wellness': 'Health & Wellness',
                'ethics-legal': 'Ethics & Legal'
              }
              
              return (
                <Link key={domain} href={`/study/${domain}`}>
                  <MotionDiv 
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{domainNames[domain as keyof typeof domainNames]}</h3>
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{progress.completed} / {progress.total} questions</span>
                        <span>{Math.round(domainProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${domainProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Accuracy: {Math.round(progress.accuracy)}%
                    </p>
                  </MotionDiv>
                </Link>
              )
            })}
          </div>
        </MotionDiv>

        {/* Quick Actions */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <Link href="/quiz">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold mb-2">Quick Quiz</h3>
              <p className="text-blue-100 text-sm">Test your knowledge with 10 random questions</p>
            </div>
          </Link>
          <Link href="/review">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold mb-2">Review Mistakes</h3>
              <p className="text-green-100 text-sm">Practice questions you got wrong</p>
            </div>
          </Link>
          <Link href="/progress">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold mb-2">View Analytics</h3>
              <p className="text-purple-100 text-sm">Detailed performance insights</p>
            </div>
          </Link>
        </MotionDiv>
      </div>
    </Layout>
  )
}
