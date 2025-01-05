'use client';

import { useParams } from 'next/navigation';
import { DATA } from '../../../../../data/data';
import { OfficeHoursTable, columns } from '@/components/office-hours';



export default function CoursePage() {
    const params = useParams();
    const course = params?.course;

    return (
      <div className="container mx-auto py-10">
        <h1>{course}</h1>
      </div>
    );
}
