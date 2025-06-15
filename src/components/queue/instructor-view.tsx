// "use client"

// import React from "react";
// import { CardInputModal } from "../custom/card-input-modal";
// import { QueueStatusTable } from "./queue-status-table"
// import type { Queue } from "@/types";
// import { Button } from "../ui/button";

// interface InstructorViewProps {
//     queue: Queue[];
//     handleRemoveFromQueue: (queueEntry: Queue[]) => void
// }

// export const InstructorView: React.FC<InstructorViewProps> = ({ queue, handleRemoveFromQueue }) => {
//     const [modalOpen, setModalOpen] = React.useState(false);

//     const handleModalOpen = () => {
//         setModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setModalOpen(false);
//     };

//     const handleFormSubmit = (formData: FormData) => {
//         console.log(formData);
//     }

//     return (
//         <main>
//             <QueueStatusTable
//                 queue={queue}
//                 handleRemoveFromQueue={handleRemoveFromQueue}
//                 handleStartSession={() => {}}
//             />
//             <div className="flex justify-center">
//                 <Button
//                     variant={"primary"}
//                     size={"default"}
//                     onClick={handleModalOpen}
//                     className="font-semibold"
//                 >
//                     Add a student
//                 </Button>
//             </div>

//             <CardInputModal
//                 header="Queue Form"
//                 isOpen={modalOpen}
//                 onClose={handleModalClose}
//                 onSubmit={handleFormSubmit}
//             />

//         </main>
//     )
// }




"use client"

import React from "react";
import { CardInputModal } from "../custom/card-input-modal";

import type { Queue } from "@/types/queue";
import { Button } from "../ui/button";

interface InstructorViewProps {
    queue: Queue[];
    handleRemoveFromQueue: (queueEntry: Queue[]) => void
}


import { useState, useEffect } from "react"
import { QueueStatusTable } from "./queue-status-table"
import { ActiveSession } from "@/components/queue/active-session"
import { ResolutionForm } from "@/components/queue/resolution-form"
import type { Student, SessionData } from "@/types/types"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function InstructorView({queue, handleRemoveFromQueue}: InstructorViewProps) {
  const [activeSession, setActiveSession] = useState<SessionData | null>(null)
  const [showResolutionForm, setShowResolutionForm] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("queue")
  const [time, setTimeTaken] = useState<number>(0)




  // Start a session with a student
  const startSession = (queue: Queue) => {
    const student = {
      id: queue.id,
      name: queue.name,
      email: queue.email,
      status: "in_progress" as const,
      created_at: new Date().toISOString(),
      position: queue.position,
    }
    setActiveSession({
      id: `session-${Date.now()}`,
      student,
      startTime: new Date(),
      isPaused: false,
    })


    // Switch to active session tab
    setActiveTab("active-session")

  }

  // End the current session
  const endSession = () => {
    if (activeSession) {
      setShowResolutionForm(true)
    }
  }

  // Pause or resume the current session
  const togglePauseSession = () => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        isPaused: !activeSession.isPaused,
      })

      const action = activeSession.isPaused ? "Resumed" : "Paused"
    }
  }

  const submitResolution = (resolution: { issue: string; resolution: string; feedback: string; email: string; time?: number }) => {
    resolution.time = time
    console.log(resolution)
    setActiveSession(null)
    setShowResolutionForm(false)
    setActiveTab("queue")
    // setNewQueue(newQueue.filter(q => q.id !== activeSession?.student.id))
  }



  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Office Hours Session Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="queue">Student Queue</TabsTrigger>
          <TabsTrigger value="active-session" disabled={!activeSession}>
            Active Session
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <QueueStatusTable queue={queue} handleRemoveFromQueue={handleRemoveFromQueue} handleStartSession={startSession} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-session" className="space-y-4">
          {activeSession && (
            <Card>
              <CardContent className="pt-6">
                <ActiveSession session={activeSession} onEndSession={endSession} onTogglePause={togglePauseSession} setTime={setTimeTaken} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {showResolutionForm && activeSession && (
        <ResolutionForm
          student={activeSession.student}
          onSubmit={submitResolution}
          onCancel={() => setShowResolutionForm(false)}
        />
      )}
    </div>
  )
}




