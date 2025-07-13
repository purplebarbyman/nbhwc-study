import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useStudy } from '@/contexts/StudyContext'
import { motion } from 'framer-motion'
import { Trophy, Target, Clock, TrendingUp, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { state } = useStudy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const totalQuestions = Object.values(state.progress).reduce((sum, domain) => sum + domain.total, 0)
  const completedQuestions = Object.values(state.progress).reduce((sum, domain) => sum + domain.completed, 0)
  const overallProgress = (completedQuestions / totalQuestions) * 100

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {state.user.name}! 
          </h1>
          <p className="text-gray-600">Ready to continue your NBHWC certification journey?</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Trophy, label: "Level", value: state.user.level, color: "text-yellow-600" },
            { icon: Target, label: "Points", value: state.user.points.toLocaleString(), color: "text-blue-600" },
            { icon: Clock, label: "Streak", value: `${state.user.streak} days`, color: "text-green-600" },
            { icon: TrendingUp, label: "Progress", value: `${Math.round(overallProgress)}%`, color: "text-purple-600" }
          ].map((stat, index) => (
            <motion.div
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
            </motion.div>
          ))}
        </div>

        <motion.div 
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
                  <motion.div 
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
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
