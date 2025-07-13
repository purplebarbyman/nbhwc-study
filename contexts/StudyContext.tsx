import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import LoadingFallback from '@/components/LoadingFallback'

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
  | { type: 'UPDATE_USER_NAME'; payload: string }
  | { type: 'RESET_PROGRESS' }

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  try {
    switch (action.type) {
      case 'ANSWER_QUESTION':
        const { domain, correct } = action.payload
        const newPoints = state.user.points + (correct ? 10 : 0)
        const newLevel = Math.floor(newPoints / 1000) + 1
        
        const newBadges = [...state.user.badges]
        if (newLevel > state.user.level) {
          newBadges.push(`Level ${newLevel} Achieved`)
        }
        if (newPoints > 0 && newPoints % 500 === 0) {
          newBadges.push(`${newPoints} Points Milestone`)
        }
        
        return {
          ...state,
          user: {
            ...state.user,
            points: newPoints,
            level: newLevel,
            badges: newBadges
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
          currentSession: {
            ...state.currentSession,
            questionsAnswered: state.currentSession.questionsAnswered + 1,
            correctAnswers: state.currentSession.correctAnswers + (correct ? 1 : 0)
          },
          error: null
        }
      
      case 'START_SESSION':
        return {
          ...state,
          currentSession: {
            domain: action.payload.domain,
            questionsAnswered: 0,
            correctAnswers: 0,
            startTime: new Date()
          },
          error: null
        }
      
      case 'END_SESSION':
        const sessionAccuracy = state.currentSession.questionsAnswered > 0 
          ? (state.currentSession.correctAnswers / state.currentSession.questionsAnswered) * 100 
          : 0
        
        const newStreak = sessionAccuracy >= 70 ? state.user.streak + 1 : state.user.streak
        const streakBadges = [...state.user.badges]
        
        if (newStreak > state.user.streak && newStreak % 7 === 0) {
          streakBadges.push(`${newStreak} Day Streak`)
        }
        
        return {
          ...state,
          user: {
            ...state.user,
            streak: newStreak,
            badges: streakBadges
          },
          currentSession: {
            domain: '',
            questionsAnswered: 0,
            correctAnswers: 0,
            startTime: null
          },
          error: null
        }
      
      case 'UPDATE_SETTINGS':
        return {
          ...state,
          settings: { ...state.settings, ...action.payload },
          error: null
        }
      
      case 'AWARD_BADGE':
        if (!state.user.badges.includes(action.payload)) {
          return {
            ...state,
            user: {
              ...state.user,
              badges: [...state.user.badges, action.payload]
            },
            error: null
          }
        }
        return state
      
      case 'LOAD_PROGRESS':
        return {
          ...action.payload,
          isLoading: false,
          error: null
        }
      
      case 'SET_LOADING':
        return {
          ...state,
          isLoading: action.payload
        }
      
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
          isLoading: false
        }
      
      case 'CLEAR_ERROR':
        return {
          ...state,
          error: null
        }
      
      case 'UPDATE_USER_NAME':
        return {
          ...state,
          user: {
            ...state.user,
            name: action.payload
          },
          error: null
        }
      
      case 'RESET_PROGRESS':
        return {
          ...initialState,
          user: {
            ...state.user,
            name: state.user.name
          }
        }
      
      default:
        return state
    }
  } catch (error) {
    console.error('StudyContext reducer error:', error)
    return {
      ...state,
      error: 'An error occurred while updating your progress. Please try again.',
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
        
        // Add delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = localStorage.getItem('nbhwc-progress')
          if (saved) {
            const parsedData = JSON.parse(saved)
            
            // Validate data structure
            if (parsedData && 
                typeof parsedData === 'object' && 
                parsedData.user && 
                parsedData.progress &&
                typeof parsedData.user === 'object' &&
                typeof parsedData.progress === 'object') {
              dispatch({ type: 'LOAD_PROGRESS', payload: parsedData })
            } else {
              console.warn('Invalid saved data structure, using initial state')
            }
          }
        }
        
        setIsInitialized(true)
        dispatch({ type: 'SET_LOADING', payload: false })
      } catch (error) {
        console.error('StudyContext initialization error:', error)
        setIsInitialized(true)
        dispatch({ type: 'SET_LOADING', payload: false })
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load study data. Starting with fresh session.' 
        })
      }
    }

    initializeContext()
  }, [])

  // Save progress to localStorage when state changes
  useEffect(() => {
    try {
      if (isInitialized && !state.isLoading && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('nbhwc-progress', JSON.stringify(state))
      }
    } catch (error) {
      console.error('Failed to save progress:', error)
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to save progress. Your session data may not persist.' 
      })
    }
  }, [state, isInitialized])

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_ERROR' })
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [state.error])

  if (!isInitialized) {
    return <LoadingFallback />
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
