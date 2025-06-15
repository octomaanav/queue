import { Queue } from "./queue"

export interface Student {
    id: string
    name: string
    email: string
    status: "waiting" | "in_progress"
    created_at: string
    position: number
  }
  
  export interface SessionData {
    id: string
    student: Student
    startTime: Date
    isPaused: boolean
  }
  
  export interface Resolution {
    issue: string
    resolution: string
    feedback: string
  }