'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import React from "react"
import { Skeleton } from "./ui/skeleton"
import { AlarmClock, UserRound } from "lucide-react"
import { useSession } from "next-auth/react"
import {AnimatedModal} from "./animated-modal"

interface QueueInfoProps {
    id: string,
    office_hours: string,
    student: string,
    position: number,
}


export default function QueueStatus({courseName, totalStudents, office_hours_id} : {courseName : string, totalStudents: number, office_hours_id: string}) {
    const [loading, setLoading] = React.useState(true);
    const [queueInfo, setQueueInfo] = React.useState<QueueInfoProps>();
    const [joinStatus, setJoinStatus] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    

    const { data: session, status } = useSession()


    React.useEffect(() => {
        const checkJoinStatus = async () => {
            try {
                setLoading(true)
                const response = await fetch("/api/queue/status", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ office_hours_id }),
                });

                const data = await response.json()
                if(data){
                    setJoinStatus(true)
                    setQueueInfo({id: data.id, office_hours: data.office_hours, student: data.student, position: data.position})
                }
                else{
                    setJoinStatus(false)
                }
            } catch (error) {
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        checkJoinStatus()
    },[office_hours_id, joinStatus])

    const handleQueueJoin = async () => {
        try {
            const response = await fetch("/api/queue/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ office_hours_id }),
            });

            if(!response.ok){
                throw new Error("Something went wrong while joining the queue")
            }
            const data = await response.json()
            if(!data){
                throw new Error("Queue data is null")
            }
            setJoinStatus(true)
            setQueueInfo(data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleQueueLeave = async () => {
        try {
            setJoinStatus(false)
            setModalOpen(false)  
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
        } catch (error) {
            console.error(error)
        }
    }

    
    const renderSkeletons = () => {
        return (
          <div className="flex flex-col mb-2 w-full">
            <Skeleton className="h-[225px] w-full rounded-xl" />
          </div>
        );
      };


    return (
        <div className="w-full">
            {loading? 
            renderSkeletons()
            :
            <Card>
                <CardHeader className="py-5 px-5">
                    <CardTitle>
                        <h1 className="text-2xl">Current Queue Status</h1>
                    </CardTitle>
                    {/* <CardDescription>
                        <p className="font-semibold text-muted-foreground">{courseName}</p>
                    </CardDescription> */}
                </CardHeader>
                <CardContent className="pb-5 px-5">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                            {/* <div className="w-2 h-2 border bg-teal-500 rounded-full animate-blicking-dot"></div> */}
                            <UserRound style={{width:"17px",height:"17px"}}/>
                            {joinStatus ?
                            <div className="flex items-center gap-1">
                                <p className="text-muted-foreground font-semibold">Your Position : </p>
                                <span className="dark:text-white text-black font-semibold">{queueInfo?.position}</span>
                            </div>
                            :
                            <div className="flex items-center gap-1">
                                <span className="dark:text-white text-black font-semibold">
                                    {`${totalStudents} `}
                                </span>
                                <p className="text-muted-foreground font-semibold">ahead of you</p>
                            </div>}
                        </div>
                        <div className="flex items-center gap-1">
                            <AlarmClock style={{width:"17px",height:"17px"}}/>
                            <p className="text-muted-foreground font-semibold">Estimated time : (insert time)</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pb-6 px-5 flex justify-center items-center">
                        {joinStatus ?
                        <Button variant="destructive" size="lg" className="w-full font-bold" onClick={()=>setModalOpen(true)}>
                            Leave the queue
                        </Button>
                        :
                        <Button variant="outline" size="lg" className="w-full font-bold" onClick={handleQueueJoin}>
                            Join this queue
                        </Button>}
                </CardFooter>
            </Card>
            }
            <AnimatedModal
                header="Confirm to leave the queue"
                description="Are you sure you want to leave the queue?"
                subDescription="This action cannot be undone"
                isOpen={modalOpen}
                onClose={handleModalClose}
                onLeave={handleQueueLeave}
            />
        </div>
    )
}