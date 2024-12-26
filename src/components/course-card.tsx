import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { div } from 'framer-motion/client';

interface CourseCardProps {
    courseName : string;
    description : string;
    instructor : boolean;
    officeHours : number;
}

export const CourseCard : React.FC<CourseCardProps> = ({courseName,description,instructor,officeHours}) => {
    return (
        // <div>
        //     <Card className='w-[350px]'>
        //         <CardHeader className='flex flex-col space-y-1.5 p-5'>
        //             <CardTitle className='flex justify-between items-center'>
        //                 <h1>{courseName}</h1>
        //             </CardTitle>
        //             <CardDescription className='text-muted-foreground font-semibold'>
        //             {instructor ? 
        //                 <div className='border border-teal-500 bg-teal-500/30 w-[65px] rounded-full px-2 text-[10px]'>
        //                 Instructor
        //                 </div>
        //                 : null}
        //             </CardDescription>
        //         </CardHeader>
        //         <CardContent className='px-5 pb-4'>
        //             <div className='text-muted-foreground text-sm font-semibold flex items-center gap-1'>
        //                 {officeHours == 0 ? 
        //                 <div className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80'>
        //                     Inactive
        //                 </div>
        //                 :
        //                 <><div className='w-2 h-2 border bg-teal-500 rounded-full animate-blicking-dot'></div><p>{`${officeHours} active office hour`}</p></>}
        //             </div>
        //         </CardContent>
        //         <CardFooter className='px-5 pb-4'>
        //             <Button variant="outline" className="w-full font-bold">
        //             View Office Hour
        //             </Button>
        //         </CardFooter>
        //     </Card>
        // </div>
        <div>
            <Card className='w-[350px]'>
                <CardHeader className='flex flex-col space-y-1.5 p-4'>
                    <CardTitle className='flex gap-3'>
                        <h1>{courseName}</h1>
                        {instructor ? 
                        <div className='border border-teal-500 bg-teal-500/30 rounded-full h-4 font-bold px-2 py-0.5 text-[10px]'>
                        Instructor
                        </div>
                        : null}
                    </CardTitle>
                    <CardDescription className='text-muted-foreground font-semibold'>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                    <div className='text-muted-foreground text-sm font-semibold flex items-center gap-1'>
                        {officeHours == 0 ? 
                        <div className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80'>
                            Inactive
                        </div>
                        :
                        <><div className='w-2 h-2 border bg-teal-500 rounded-full animate-blicking-dot'></div><p>{`${officeHours} active office hour`}</p></>}
                    </div>
                </CardContent>
                <CardFooter className='px-4 pb-4'>
                    <Button variant="outline" className="w-full font-bold">
                    View Office Hour
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )

}