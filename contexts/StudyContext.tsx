import React, { createContext, useContext, useReducer, useEffect } from 'react'

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
  }
}

type StudyAction = 
  | { type: 'ANSWER_QUESTION'; payload: { domain: string; correct: boolean } }
  | { type: 'START_SESSION'; payload: { domain: string } }
  | { type: 'END_SESSION' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<StudyState['settings']> }
  | { type: 'AWARD_BADGE'; payload: string }
  | { type: 'LOAD_PROGRESS'; payload: StudyState }

function studyReducer(state: StudyState, action: StudyAction): StudyState {
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
        currentSession: {
          ...state.currentSession,
          questionsAnswered: state.currentSession.questionsAnswered + 1,
          correctAnswers: state.currentSession.correctAnswers + (correct ? 1 : 0)
        }
      }
    
    case 'START_SESSION':
      return {
        ...state,
        currentSession: {
          domain: action.payload.domain,
          questionsAnswered: 0,
          correctAnswers: 0,
          startTime: new Date()
        }
      }
    
    case 'END_SESSION':
      return {
        ...state,
        currentSession: {
          domain: '',
          questionsAnswered: 0,
          correctAnswers: 0,
          startTime: null
        }
      }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case 'AWARD_BADGE':
      return {
        ...state,
        user: {
          ...state.user,
          badges: [...state.user.badges, action.payload]
        }
      }
    
    case 'LOAD_PROGRESS':
      return action.payload
    
    default:
      return state
  }
}

const StudyContext = createContext<{
  state: StudyState
  dispatch: React.Dispatch<StudyAction>
} | null>(null)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem('nbhwc-progress')
    if (saved) {
      dispatch({ type: 'LOAD_PROGRESS', payload: JSON.parse(saved) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nbhwc-progress', JSON.stringify(state))
  }, [state])

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
