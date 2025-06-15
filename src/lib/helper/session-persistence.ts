import type { SessionData } from "../../types/types"

const SESSION_STORAGE_KEY = "active_office_hours_session"

export const sessionPersistence = {
  // Save session to localStorage
  saveSession: (session: SessionData | null) => {
    try {
      if (session) {
        const sessionToStore = {
          ...session,
          startTime: session.startTime.toISOString(), // Convert Date to string for storage
        }
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionToStore))
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY)
      }
    } catch (error) {
      console.error("Error saving session to localStorage:", error)
    }
  },

  // Load session from localStorage
  loadSession: (): SessionData | null => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
      if (storedSession) {
        const parsed = JSON.parse(storedSession)
        return {
          ...parsed,
          startTime: new Date(parsed.startTime), // Convert string back to Date
        }
      }
      return null
    } catch (error) {
      console.error("Error loading session from localStorage:", error)
      return null
    }
  },

  // Clear session from localStorage
  clearSession: () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing session from localStorage:", error)
    }
  },

  // Check if there's a stored session
  hasStoredSession: (): boolean => {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY) !== null
    } catch (error) {
      return false
    }
  },
}
