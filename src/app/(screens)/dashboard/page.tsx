'use client'

import { CourseCard } from '@/components/course-card';
import React, { use, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserCoursesFromAutolab, getUserCoursesFromSession } from '@/lib/user_info/getUserInfo';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
interface UserCourse{
  auth_level:string,
  display_name:string,
  name:string,
}


export default function Dashboard() {
  const [userCourses, setUserCourses] = React.useState<UserCourse[]>([]);
  const [loading, setLoading] = React.useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const user_courses = await getUserCoursesFromSession();
        if(user_courses){
          setUserCourses(user_courses);
          return;
        }else if(session?.user?.accessToken){
          const user_courses = await getUserCoursesFromAutolab({
            access_token: session.user.accessToken,
          });
          setUserCourses(user_courses);
          return
        }else{
          setUserCourses([]);
        }
        
        // if (session?.user?.courses) {
        //   const formattedCourses: UserCourse[] = session.user.courses.map((course: any) => ({
        //     auth_level: course.auth_level,
        //     display_name: course.display_name,
        //     name: course.name,
        //   }));
        //   setUserCourses(formattedCourses);
        // } else if (session?.user?.accessToken) {
        //   const user_courses = await getUserCoursesFromAutolab({
        //     access_token: session.user.accessToken,
        //   });
        //   setUserCourses(user_courses);
        // } else {
        //   setUserCourses([]);
        // }
      } catch (error) {
        console.error("An error occurred while fetching user courses:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (status === "authenticated") {
      fetchUserCourses();
    }
  }, [session, status]);
  
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

// 'use client';

// import { useSession } from "next-auth/react";

// export default function Dashboard() {
//   const { data: session, status } = useSession();

//   // Debugging log
//   console.log(session);

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }
  
//   if (status === "unauthenticated") {
//     return <p>You need to log in first!</p>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {session?.user?.name}</h1>
//       <p>Your email: {session?.user?.email}</p>
//     </div>
//   );
// }

