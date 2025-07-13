import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useStudy } from '@/contexts/StudyContext'
import { BookOpen, ArrowLeft, Play, CheckCircle, Clock, Target, Award } from 'lucide-react'
import Link from 'next/link'

export default function StudyDomain() {
  const router = useRouter()
  const { domain } = router.query
  const { state, dispatch } = useStudy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !domain) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const domainNames = {
    'coaching-structure': 'Coaching Structure',
    'coaching-process': 'Coaching Process',
    'health-wellness': 'Health & Wellness',
    'ethics-legal': 'Ethics & Legal'
  }

  const domainDescriptions = {
    'coaching-structure': 'Master the foundational elements of coaching practice, including legal frameworks, professional boundaries, and scope of practice definitions.',
    'coaching-process': 'Develop expertise in core coaching competencies including motivational interviewing, active listening, goal setting, and session management.',
    'health-wellness': 'Learn essential health and wellness concepts including nutrition fundamentals, physical activity principles, and behavior change psychology.',
    'ethics-legal': 'Understand professional ethics, legal responsibilities, confidentiality requirements, and when to refer clients to other professionals.'
  }

  const domainContent = {
    'coaching-structure': [
      { title: 'Legal Frameworks & Ethics', description: 'Understanding the legal landscape of health coaching', questions: 125 },
      { title: 'Coaching Agreements', description: 'Creating effective coaching contracts and boundaries', questions: 100 },
      { title: 'Scope of Practice', description: 'Defining what coaches can and cannot do', questions: 150 },
      { title: 'Professional Standards', description: 'NBHWC competencies and certification requirements', questions: 125 }
    ],
    'coaching-process': [
      { title: 'Motivational Interviewing', description: 'Core MI principles and techniques for behavior change', questions: 300 },
      { title: 'Active Listening & Questioning', description: 'Developing powerful listening and inquiry skills', questions: 250 },
      { title: 'Goal Setting & Planning', description: 'SMART goals and accountability systems', questions: 350 },
      { title: 'Session Structure & Flow', description: 'Optimal coaching session design and management', questions: 300 }
    ],
    'health-wellness': [
      { title: 'Nutrition Fundamentals', description: 'Basic nutrition science for wellness coaching', questions: 150 },
      { title: 'Physical Activity Principles', description: 'Exercise guidelines and movement coaching', questions: 125 },
      { title: 'Sleep & Stress Management', description: 'Sleep hygiene and stress reduction techniques', questions: 150 },
      { title: 'Behavior Change Psychology', description: 'Understanding motivation and habit formation', questions: 150 }
    ],
    'ethics-legal': [
      { title: 'Professional Boundaries', description: 'Maintaining appropriate coach-client relationships', questions: 100 },
      { title: 'Confidentiality & HIPAA', description: 'Privacy laws and information protection', questions: 75 },
      { title: 'Referral Guidelines', description: 'When and how to refer clients to other professionals', questions: 100 },
      { title: 'Ethical Decision Making', description: 'Navigating complex ethical dilemmas in coaching', questions: 75 }
    ]
  }

  const domainName = domainNames[domain as keyof typeof domainNames] || 'Study Domain'
  const domainKey = domain as string
  const progress = state.progress[domainKey] || { completed: 0, total: 500, accuracy: 0 }
  const progressPercent = (progress.completed / progress.total) * 100
  const content = domainContent[domain as keyof typeof domainContent] || []

  const handleStartStudying = () => {
    dispatch({ type: 'START_SESSION', payload: { domain: domainKey } })
    // For now, redirect to dashboard since we don't have quiz functionality yet
    router.push('/dashboard')
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Domain Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">{domainName}</h1>
          </div>
          
          <p className="text-gray-600 mb-6 text-lg">
            {domainDescriptions[domain as keyof typeof domainDescriptions]}
          </p>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Your Progress in {domainName}
            </h3>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{progress.completed}</div>
                <div className="text-sm text-gray-600">Questions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(progress.accuracy)}%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(progressPercent)}%</div>
                <div className="text-sm text-gray-600">Domain Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{progress.total}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Domain Progress</span>
                <span>{Math.round(progressPercent)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleStartStudying}
                className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Studying This Domain
              </button>
              <Link href="/dashboard">
                <button className="flex items-center justify-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Study Topics */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Study Topics in {domainName}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {content.map((topic, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-all hover:border-blue-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">{topic.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {topic.questions} questions
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  Start Topic
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Award className="w-6 h-6 mr-2 text-green-600" />
            Study Tips for {domainName}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-800">Recommended Study Approach</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Start with foundational concepts</li>
                <li>• Practice with scenario-based questions</li>
                <li>• Review explanations for incorrect answers</li>
                <li>• Take practice tests regularly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-800">Time Allocation</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Spend 15-30 minutes per study session</li>
                <li>• Focus on weak areas identified in analytics</li>
                <li>• Review material within 24 hours</li>
                <li>• Take breaks between intensive study periods</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
