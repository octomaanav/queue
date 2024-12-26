import { CourseCard } from '@/components/course-card';
import { main } from 'framer-motion/client';
import React from 'react';
import {DATA} from '../../../data/data'

export default function Dashboard() {
  return (
    <main className='p-10'>
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