'use client';

import { getUserCoursesFromCookies } from '@/lib/user_info/getUserInfo';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { DATA } from '../../../../../data/data';
import React, { useEffect } from 'react';
import { OfficeHoursCard } from '@/components/office-hours';
import { initialize } from '../../../../../supabase';
import { getCourseId, getOfficeHoursSchedule } from '@/lib/supabase/userHelper';
import { Skeleton } from '@/components/ui/skeleton';
import { h1 } from 'framer-motion/client';


interface UserCourse {
  auth_level: string;
  display_name: string;
  name: string;
}

interface OfficeHours {
  id: string;
  location: string;
  start: number;
  end: number;
  day: number
  instructors: string[];
}

export default function CoursePage() {
  const [courses, setCourses] = React.useState<UserCourse[]>([]);
  const [officeHours, setOfficeHours] = React.useState<OfficeHours[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseCode: string = params?.course as string;
  const courseName = searchParams.get('course');

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const user_courses = await getUserCoursesFromCookies();
        const isAuthorized = user_courses.some((course: UserCourse) => course.name === courseCode && course.display_name === courseName);
        setAuthorized(isAuthorized);
        if (isAuthorized) {
          setCourses(user_courses);
        } else {
          router.push('/error');
        }
      } catch (error) {
        console.error("An error occurred while fetching user courses:", error);
        router.push('/error');
      } finally {
      }
    };

    fetchUserCourses();
  }, [courseCode, courseName, router]);


  useEffect(() => {
    const fetchOfficeHours = async () => {
      try {
        setLoading(true);
        const response  = await fetch("/api/token")
        if(!response.ok){
          throw new Error("Error while fetching user courses");
        }
        const access_token = await response.json();
        if(courseName && courseCode){
          const courseId = await getCourseId(courseName, courseCode, access_token);
          const schedule = await getOfficeHoursSchedule(access_token,courseId);
          setOfficeHours(schedule);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOfficeHours();
  }, []);

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((i, index) => (
      <div key={index} className="flex flex-col mb-3 space-y-2 w-full lg:w-[350px]">
        <Skeleton className="h-[110px] w-full rounded-xl" />
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-10">
    {loading ?
    renderSkeletons()
    :officeHours.map((OH) => (
          <OfficeHoursCard
            key = {OH.id}
            id={OH.id}
            location={OH.location}
            start={OH.start}
            end={OH.end}
            day={OH.day}
            instructors={['Manav','Amit','Thiru']}
          />
        ))}
    </div>
  );
}
