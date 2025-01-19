'use client'

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import React from "react"
import { Skeleton } from "./ui/skeleton"
import { AlarmClock, UserRound } from "lucide-react"


export default function QueueStatus({courseName, totalStudents} : {courseName : string, totalStudents: number}) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loading = () => {
            if(!courseName){
                setLoading(true)
            }
            else{
                setLoading(false)
            }
        }
        loading()
    }, [courseName, totalStudents])

    const handleQueueJoin = () => {
        console.log("Join this queue")
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
            {loading ? 
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
                            <p className="text-muted-foreground font-semibold">
                                <span className="dark:text-white text-black">
                                    {`${totalStudents} `}
                                </span>
                                ahead of you
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <AlarmClock style={{width:"17px",height:"17px"}}/>
                            <p className="text-muted-foreground font-semibold">Estimated time : (insert time)</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pb-6 px-5 flex justify-center items-center">
                        <Button variant="outline" size="lg" className="w-full font-bold" onClick={handleQueueJoin}>
                            Join this queue
                        </Button>
                </CardFooter>
            </Card>
            }
        </div>
    )
}