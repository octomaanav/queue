'use client'
import AnnouncementCard from "@/components/queue/announcement-card";
import OfficeHoursInfoCard from "@/components/queue/office-hours-info-card";
import QueueStatus from "@/components/queue/queue-status-card";
import { QueueStatusTable } from "@/components/queue/queue-status-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourseName, getOfficeHoursEntry } from "@/lib/helper/getFromDatabase";
import { getUserCoursesFromSession } from "@/lib/helper/getUserInfo";
import { getQueue, removeFromQueue } from "@/lib/helper/queueHelper";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react"
import type { Queue } from "@/types";
import { QueueForm } from "@/components/queue/queue-form";

interface UserCourse{
    auth_level:string,
    display_name:string,
    name:string,
}
export default function QueuePage() {
    const [authLevel, setAuthLevel] = React.useState<"student" | "instructor" | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [course, setCourse] = React.useState<UserCourse>();
    const [queue, setQueue] = React.useState<Queue[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const { data: session, status } = useSession();
    const params = useParams();
    const office_hours_id: string = params?.office_hours_id as string;

    React.useEffect(() => {
        const validateQueue = async () => {
            try {
                setLoading(true);
                setError(null);

                const officeHourEntry = await getOfficeHoursEntry(office_hours_id);
                if (!officeHourEntry) {
                    setError("Invalid office hours queue.");
                    return;
                }
                const current_course = await getCourseName(officeHourEntry.class);
                const user_courses = await getUserCoursesFromSession();
                const user_course = user_courses.find(
                    (course: any) =>
                        course.display_name === current_course.name &&
                        course.name === current_course.code
                );

                if (!user_course) {
                    setError("User is not authorized to view this queue.");
                    return;
                }

                setCourse(user_course);
                setAuthLevel(user_course.auth_level);
            } catch (error) {
                console.error("Error while validating queue:", error);
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (status === "unauthenticated") {
            signOut({
                redirect: true,
                callbackUrl: "/",
            });
        } else {
            validateQueue();
        }
    }, [status, session, office_hours_id]);

    React.useEffect(() => {
        const getQueueInfo = async () => {
            try {
                if (queue.length > 0) return;
                setLoading(true);
                const fetchedQueue = await getQueue(office_hours_id);

                if (!fetchedQueue) {
                    console.error("Error while fetching queue info");
                    return;
                }
                if (Array.isArray(fetchedQueue)) {
                    setQueue(fetchedQueue);
                } else {
                    console.error("Queue is not an array");
                }
            } catch (error) {
                console.error("Error while fetching queue info:", error);
            } finally {
                setLoading(false);
            }
        };

        if (status !== "unauthenticated") {
            getQueueInfo();
        }
    }, [status, session, office_hours_id, queue]);

    const renderSkeletons = () => (
        <div>
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col mb-3 w-full lg:w-[350px]">
                    <Skeleton className="h-[200px] w-full rounded-xl lg:w-[350px]" />
                </div>
            ))}
        </div>
    );

    const handleRemoveFromQueue = async (queueEntry: Queue[]) => {
        const updatedQueue = await removeFromQueue(queueEntry);
        console.log("Updated queue:", updatedQueue);
        if (queueEntry) {
            setQueue((prevQueue) => {
                const updatedQueue = prevQueue.filter((entry) => !queueEntry.includes(entry));
                return updatedQueue.map((entry, index) => ({
                    ...entry,
                    position: index + 1,
                }));
            });
        } else {
            console.error("Error while removing from queue");
        }
    };

    const renderStudentView = () => (
        <div className="flex-col space-y-4">
        </div>
    );

    const renderInstructorView = () => (
        <div className="">
            <QueueStatusTable
                queue={queue}
                handleRemoveFromQueue={handleRemoveFromQueue}
            />
        </div>
    );

    if (loading || authLevel === null) {
        return <main className="px-7 py-4">{renderSkeletons()}</main>;
    }

    if (error) {
        return <main className="px-7 py-4">{error}</main>;
    }

    return (
        <main className="px-7 py-4">
            <h1 className="md:text-3xl text-2xl font-bold mb-4">Student Queue</h1>
            {authLevel === "student" ? renderStudentView() : renderInstructorView()}
        </main>
    );
}
