'use client'

import { CourseCard } from '@/components/course-card';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserCoursesFromAutolab, getUserCoursesFromCookies } from '@/lib/user_info/getUserInfo';
import { s } from 'framer-motion/client';
interface UserCourse{
  auth_level:string,
  display_name:string,
  name:string,
}


export default function Dashboard() {
  const [userCourses, setUserCourses] = React.useState<UserCourse[]>([]);
  const [loading, setLoading] = React.useState(true);

  // useEffect(() => {
  //   const fetchUserCourses = async () => {
  //     try{
  //       setLoading(true);
  //       const response = await fetch("/api/course");
  //       if(!response.ok){
  //         throw new Error("Error while fetching user courses");
  //       }

  //       const courseData = await response.json();
  //       setUserCourses(courseData);
  //     }catch(error){
  //       throw new Error("An error occurred while fetching user courses");
  //   }finally{
  //     setLoading(false);
  //   }
  // }
  // fetchUserCourses();
  // },[])

  useEffect(() => {
    const fetchUserCourses = async () => {
      try{
        setLoading(true);
        const response = await fetch("/api/token");
        if(!response.ok){
          throw new Error("Error while fetching user courses");
        }
        const user_courses = await getUserCoursesFromCookies();
        setUserCourses(user_courses);
      }catch(error){
        throw new Error("An error occurred while fetching user courses");
    }finally{
      setLoading(false);
    }}
    fetchUserCourses();
  },[])


  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((i, index) => (
      <div key={index} className="flex flex-col space-y-2 w-full lg:w-[350px]">
        <Skeleton className="h-[125px] w-full rounded-xl lg:w-[350px]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    ));
  };

  return (
    <main className='px-10 py-5'>
        <h1 className='text-4xl font-bold mb-4'>Dashboard</h1>
        <div className='flex flex-wrap gap-4'>
        {loading?
        renderSkeletons()
        : userCourses.length > 0 ? 
        userCourses.map((course) => {
                return(
                    <CourseCard 
                    key={course.name}
                    courseName={course.display_name}
                    courseCodeName={course.name}
                    description={"Very good course"}
                    instructor={course.auth_level == "instructor" ? true : false}
                    officeHours={5}
                    />
                )
            })
          :
          <h1 className='mx-auto mt-[10rem] text-3xl font-semibold'>You don't have any current courses!</h1>
          }
        </div>
    </main>
  );
}