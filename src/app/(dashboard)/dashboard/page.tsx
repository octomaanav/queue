'use client'

import { CourseCard } from '@/components/course-card';
import React, { useEffect } from 'react';
import {DATA} from '../../../../data/data'


export default function Dashboard() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  
  // useEffect(() =>{
  //   const fetchAccessToken = async () => {
  //     try{
  //       const response = await fetch("/api/token");
  //       if(!response.ok){
  //         throw new Error("Error while fetching access token");
  //       }
  //       const tokenData = await response.json();
  //       const accessToken = tokenData.accessToken;
  //       setAccessToken(accessToken);
        
  //   }catch(error){
  //     console.error("Error while fetching access token", error);
  //   }
  //   fetchAccessToken();
  // }},[])

  useEffect(() => {
    // Fetch the access token from the /api/token route
    const fetchAccessToken = async () => {
      
      try {
        
        const response = await fetch('/api/token');
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken); // Set the access token to state
        } else {
          console.error('Failed to fetch access token:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchAccessToken();
  }, []);
  console.log(accessToken);
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