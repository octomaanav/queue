'use client'

import { CourseCard } from '@/components/course-card';
import React, { useEffect } from 'react';
import {DATA} from '../../../../data/data'


export default function Dashboard() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  
  useEffect(() =>{
    const fetchAccessToken = async () => {
      try{
        const response = await fetch("/api/token");
        if(!response.ok){
          throw new Error("Error while fetching user data");
        }
        const userData = await response.json();
        setAccessToken(userData);

    }catch(error){
      console.error("Error while getting user data", error);
    }
  }
    fetchAccessToken();
  },[])

  console.log(accessToken);

  // useEffect(() => {
  //   const fetchUserToken = async () => {
  //     try{
  //       const response = await fetch("https://autolab.cse.buffalo.edu/api/v1/user", {
  //         headers:{
  //             Authorization: `Bearer ${accessToken}`
  //         }
  //       })
  //       if(!response.ok){
  //         throw new Error("Error while getting user data");
  //       }
  //       const userData = await response.json();
  //       console.log(userData);
  //     }catch(error){
  //       console.error("Error while fetching user data", error);
  //   }
  // }
  //   fetchUserToken();
  // },[accessToken])


  return (
    <main className='px-10 py-5'>
        <h1 className='text-4xl font-bold mb-4'>Dashboard</h1>
        <div className='flex flex-wrap gap-4'>
            {DATA.map((course) => {
                return(
                    <CourseCard 
                    key={course.id}
                    courseName={course.courseName}
                    description={course.description}
                    instructor={course.instructor}
                    officeHours={course.officeHours}
                    />
                )
            })}
        </div>

    </main>
  );
}