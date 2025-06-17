'use client'

import { BookOpen, CheckCircle, Clock, Users, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { useState, useEffect } from "react"
import QueueStatus from "./queue-status-card"
import QueueStatusCard from "./queue-status-card"
import { Queue } from "@/types"
import { UserCourse } from "@/types/types"


interface StudentViewProps {
    queue: Queue[]
    course: UserCourse
    office_hours_id: string
}

export default function StudentView({queue, course, office_hours_id}:StudentViewProps) {
  // Session state
  const [sessionStatus, setSessionStatus] = useState<"waiting" | "active" | "completed">("completed")
  const [sessionTimer, setSessionTimer] = useState<string>("00:00")


  // Timer effect for active sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStatus === "active") {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setSessionTimer(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);


  return (
        <div className="container mx-auto p-4 max-w-2xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Office Hours Queue</h1>
            <p className="text-muted-foreground mt-2">Track the queue status</p>
          </div>
    
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{"Manav Sharma"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-semibold flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          

          <QueueStatusCard queue={queue} courseName={course.name} office_hours_id={office_hours_id}/>
    
          {/* Session Status Card
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Session Status</span>
                <Badge
                  variant={sessionStatus === "active" ? "default" : sessionStatus === "completed" ? "secondary" : "outline"}
                >
                  {sessionStatus === "active" ? "In Progress" : sessionStatus === "completed" ? "Completed" : "Waiting"}
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
                      <p className="text-2xl font-bold text-primary">{estimatedWaitTime}</p>
                      <p className="text-sm text-muted-foreground">Estimated Wait</p>
                    </div>
                  </div>
    
                  <div className="text-center text-sm text-muted-foreground">
                    {totalInQueue} student{totalInQueue !== 1 ? "s" : ""} total in queue
                  </div>
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
                  <p className="text-muted-foreground">Thank you for using office hours. Have a great day!</p>
                </div>
              )}
            </CardContent>
          </Card> */}

          {/* {!hasJoinedQueue ? (
            <Card className="border-dashed border-2 border-primary/30">
                <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Join Queue</span>
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                <Users className="mx-auto h-16 w-16 text-primary/60" />
                <h3 className="text-xl font-semibold mt-4">Ready to join office hours?</h3>
                <p className="text-muted-foreground">
                    Click below to join the queue and get help from a TA.
                </p>


                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                    <p className="text-2xl font-bold text-primary">{totalInQueue}</p>
                    <p className="text-sm text-muted-foreground">In Queue</p>
                    </div>
                    <div>
                    <p className="text-2xl font-bold text-primary">{estimatedWaitTime}</p>
                    <p className="text-sm text-muted-foreground">Est. Wait Time</p>
                    </div>
                </div>

                <Button className="w-full mt-4" onClick={() => {
                    setHasJoinedQueue(true)
                    setSessionStatus("waiting")
                }}>
                    Join the Queue
                </Button>
                </CardContent>
            </Card>
            ) : (
            // Session Status Card (Same as your existing logic)
            <Card className="border-2 border-primary/20">
                <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Session Status</span>
                    <Badge
                    variant={sessionStatus === "active" ? "default" : sessionStatus === "completed" ? "secondary" : "outline"}
                    >
                    {sessionStatus === "active" ? "In Progress" : sessionStatus === "completed" ? "Completed" : "Waiting"}
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
                        <p className="text-2xl font-bold text-primary">{estimatedWaitTime}</p>
                        <p className="text-sm text-muted-foreground">Estimated Wait</p>
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        {totalInQueue} student{totalInQueue !== 1 ? "s" : ""} total in queue
                    </div>

                    <Button variant="ghost" className="w-full mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                        setHasJoinedQueue(false)
                        setSessionStatus("waiting")
                        }}>
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
                    <p className="text-muted-foreground">Thank you for using office hours. Have a great day!</p>
                    </div>
                )}
                </CardContent>
            </Card>
            )} */}

        </div>
  )
}