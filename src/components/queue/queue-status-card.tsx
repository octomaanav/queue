'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import React, { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { CheckCircle, Clock, Users } from "lucide-react"
import { AnimatedModal } from "../custom/animated-modal"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Queue } from "@/types"
import { studentSessionPersistence } from "@/lib/helper/session-persistence"

interface QueueStatusProps {
  queue: Queue[]
  courseName: string
  office_hours_id: string
}

export default function QueueStatus({ queue, courseName, office_hours_id }: QueueStatusProps) {
  const [loading, setLoading] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoinedQueue, setHasJoinedQueue] = useState(false)
  const [sessionStatus, setSessionStatus] = useState<"waiting" | "active" | "completed">("waiting")
  const [queuePosition, setQueuePosition] = useState(0)
  const [taName, setTaName] = useState("Amit")
  const [sessionTimer, setSessionTimer] = useState("00:00")
  const [modalOpen, setModalOpen] = useState(false)
  const [queueData, setQueueData] = useState<Queue[]>(queue)

  const estimatedWaitTime = queueData.length * 5

  useEffect(() => {
    const storedSession = studentSessionPersistence.loadSession()
    if(studentSessionPersistence.hasStoredSession() && storedSession != null){
      setHasJoinedQueue(storedSession.hasJoinedQueue)
      setSessionStatus(storedSession.sessionStatus)
    }
  }, [])

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch("/api/queue/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ office_hours_id }),
        })
        const data = await response.json()
        setQueueData(data)
      } catch (err) {
        console.error("Failed to fetch queue:", err)
      }finally{
        setLoading(false)
      }
    }
  
    fetchQueue()
    const interval = setInterval(fetchQueue, 1000 * 10) // Poll every 10 seconds
  
    return () => clearInterval(interval) // Cleanup on unmount
  }, [office_hours_id])
  
  const handleJoinQueue = async () => {
    try {
      setIsJoining(true)
      const response = await fetch("/api/queue/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ office_hours_id }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to join the queue")
      }
  
      const data = await response.json()
      if (data?.position != null) {
        setQueuePosition(data.position)
        setHasJoinedQueue(true)
        setSessionStatus("waiting")
        studentSessionPersistence.saveSession({
          hasJoinedQueue: true,
          sessionStatus: "waiting",
          queuePosition: data.position,
          office_hours_id
        })
      } else {
        throw new Error("No position returned")
      }
  
    } catch (error) {
      console.error("Join error:", error)
    } finally {
      setIsJoining(false)
    }
  }
  
  const handleLeaveQueue = async () => {
    try {
        setIsJoining(true)
        const response = await fetch("/api/queue/leave",{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({office_hours_id})
        })
        const data = await response.json()
        const {leftQueue} = data
        if(!leftQueue){
            throw new Error("Error while removing user from the queue")
        }

      setHasJoinedQueue(false)
      setSessionStatus("waiting")
    } catch (error) {
      console.error("Leave error:", error)
    } finally {
      setModalOpen(false)
      setIsJoining(false)
      studentSessionPersistence.clearSession()
    }
  }

  const handleEndSession = () => {
    setSessionStatus("completed")
  }

  const renderSkeleton = () => (
    <div className="flex flex-col mb-2 w-full">
      <Skeleton className="h-[225px] w-full rounded-xl" />
    </div>
  )

  return (
    <div className="w-full">
      {loading ? (
        renderSkeleton()
      ) : !hasJoinedQueue ? (
        <Card className="border-dashed border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Join Queue</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Users className="mx-auto h-16 w-16 text-primary/60" />
            <h3 className="text-xl font-semibold mt-4">Ready to join office hours?</h3>
            <p className="text-muted-foreground">Click below to join the queue and get help from a TA.</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-primary">{queueData.length}</p>
                <p className="text-sm text-muted-foreground">In Queue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{estimatedWaitTime} min</p>
                <p className="text-sm text-muted-foreground">Est. Wait</p>
              </div>
            </div>

            <Button loading={isJoining} className="w-full mt-4" onClick={handleJoinQueue}>
              Join the Queue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Session Status</span>
              <Badge variant={
                sessionStatus === "active" ? "default" :
                sessionStatus === "completed" ? "secondary" :
                "outline"
              }>
                {sessionStatus === "active" ? "In Progress" :
                 sessionStatus === "completed" ? "Completed" : "Waiting"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionStatus === "waiting" && (
              <>
                <div className="text-center py-6">
                  <Users className="mx-auto h-16 w-16 text-primary/60" />
                  <h3 className="text-xl font-semibold mt-4">You're in the queue!</h3>
                  <p className="text-muted-foreground">Please wait for a TA to assist you</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{queuePosition}</p>
                    <p className="text-sm text-muted-foreground">Position in Queue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{estimatedWaitTime} min</p>
                    <p className="text-sm text-muted-foreground">Estimated Wait</p>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {queueData.length} student{queueData.length !== 1 && "s"} in queue
                </div>

                <Button loading={isJoining} variant="destructive" className="w-full mt-4" onClick={handleLeaveQueue}>
                  Leave Queue
                </Button>
              </>
            )}

            {sessionStatus === "active" && (
              <>
                <div className="text-center py-6">
                  <Clock className="mx-auto h-16 w-16 text-green-500" />
                  <h3 className="text-xl font-semibold mt-4 text-green-700">Session Active!</h3>
                  <p className="text-muted-foreground">{taName} is helping you now</p>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Session Duration</p>
                  <p className="text-3xl font-mono font-bold">{sessionTimer}</p>
                </div>

                <Button onClick={handleEndSession} className="w-full" variant="outline">
                  End Session
                </Button>
              </>
            )}

            {sessionStatus === "completed" && (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h3 className="text-xl font-semibold mt-4 text-green-700">Session Complete!</h3>
                <p className="text-muted-foreground">Thanks for attending office hours!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AnimatedModal
        header="Confirm to leave the queue"
        description="Are you sure you want to leave the queue?"
        subDescription="This action cannot be undone"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLeave={handleLeaveQueue}
      />
    </div>
  )
}
