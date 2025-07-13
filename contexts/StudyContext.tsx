import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'

interface StudyState {
  user: {
    name: string
    level: number
    points: number
    streak: number
    badges: string[]
  }
  progress: {
    [domain: string]: {
      completed: number
      total: number
      accuracy: number
      timeSpent: number
    }
  }
  settings: {
    studyHoursPerWeek: number
    targetDate: string
    learningStyle: string
  }
  currentSession: {
    domain: string
    questionsAnswered: number
    correctAnswers: number
    startTime: Date | null
  }
  isLoading: boolean
  error: string | null
}

const initialState: StudyState = {
  user: {
    name: 'Student',
    level: 1,
    points: 0,
    streak: 0,
    badges: []
  },
  progress: {
    'coaching-structure': { completed: 0, total: 500, accuracy: 0, timeSpent: 0 },
    'coaching-process': { completed: 0, total: 1200, accuracy: 0, timeSpent: 0 },
    'health-wellness': { completed: 0, total: 575, accuracy: 0, timeSpent: 0 },
    'ethics-legal': { completed: 0, total: 350, accuracy: 0, timeSpent: 0 }
  },
  settings: {
    studyHoursPerWeek: 10,
    targetDate: '',
    learningStyle: 'visual'
  },
  currentSession: {
    domain: '',
    questionsAnswered: 0,
    correctAnswers: 0,
    startTime: null
  },
  isLoading: false,
  error: null
}

type StudyAction = 
  | { type: 'ANSWER_QUESTION'; payload: { domain: string; correct: boolean } }
  | { type: 'START_SESSION'; payload: { domain: string } }
  | { type: 'END_SESSION' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<StudyState['settings']> }
  | { type: 'AWARD_BADGE'; payload: string }
  | { type: 'LOAD_PROGRESS'; payload: StudyState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  try {
    switch (action.type) {
      case 'ANSWER_QUESTION':
        const { domain, correct } = action.payload
        const newPoints = state.user.points + (correct ? 10 : 0)
        const newLevel = Math.floor(newPoints / 1000) + 1
        
        return {
          ...state,
          user: {
            ...state.user,
            points: newPoints,
            level: newLevel
          },
          progress: {
            ...state.progress,
            [domain]: {
              ...state.progress[domain],
              completed: state.progress[domain].completed + 1,
              accuracy: correct 
                ? (state.progress[domain].accuracy * (state.progress[domain].completed - 1) + 100) / state.progress[domain].completed
                : (state.progress[domain].accuracy * (state.progress[domain].completed - 1)) / state.progress[domain].completed
            }
          },
          error: null
        }
      
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload }
      
      case 'SET_ERROR':
        return { ...state, error: action.payload, isLoading: false }
      
      case 'CLEAR_ERROR':
        return { ...state, error: null }
      
      case 'LOAD_PROGRESS':
        return { ...action.payload, isLoading: false, error: null }
      
      default:
        return state
    }
  } catch (error) {
    console.error('StudyContext reducer error:', error)
    return {
      ...state,
      error: 'An error occurred while updating your progress.',
      isLoading: false
    }
  }
}

const StudyContext = createContext<{
  state: StudyState
  dispatch: React.Dispatch<StudyAction>
} | null>(null)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeContext = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        // Ensure we're in browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const saved = localStorage.getItem('nbhwc-progress')
          if (saved) {
            try {
              const parsedData = JSON.parse(saved)
              if (parsedData && typeof parsedData === 'object' && parsedData.user) {
                dispatch({ type: 'LOAD_PROGRESS', payload: parsedData })
              }
            } catch (parseError) {
              console.warn('Failed to parse saved data:', parseError)
            }
          }
        }
        
        setIsInitialized(true)
        dispatch({ type: 'SET_LOADING', payload: false })
      } catch (error) {
        console.error('StudyContext initialization error:', error)
        setIsInitialized(true)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load study data' })
      }
    }

    initializeContext()
  }, [])

  // Save progress safely
  useEffect(() => {
    if (isInitialized && !state.isLoading && typeof window !== 'undefined') {
      try {
        localStorage.setItem('nbhwc-progress', JSON.stringify(state))
      } catch (error) {
        console.error('Failed to save progress:', error)
      }
    }
  }, [state, isInitialized])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NBHWC Study Platform</h1>
          <p className="text-gray-600">Initializing your study environment...</p>
        </div>
      </div>
    )
  }

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (!context) {
    throw new Error('useStudy must be used within StudyProvider')
  }
  return context
}
