'use server'

import {v4 as uuid} from 'uuid';
import { NextResponse } from "next/server";
import { initialize } from '../../../supabase';

export async function pushUserToDataBase({name, email, access_token}: {name: string, email: string, access_token:string}){
    const userId = uuid();
    const supabase = await initialize({access_token});

    if (!supabase) {
        return NextResponse.json({error: "Supabase client is not initialized"}, {status: 500});
    }

    try{
        const {data : existingUser, error : userError} = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

        if(userError && userError.code != 'PGRST116'){
            return NextResponse.json({error: "Error while checking for existing user", details: userError}, {status: 500});
        }

        if(existingUser){
            return existingUser;
        }



        const {error : insertError} = await supabase
        .from('users')
        .insert([{id: userId, name: name, email: email}]);

        if(insertError){
            return NextResponse.json({error: "Error while inserting user", details: insertError}, {status: 500});
        }

        return userId;
        
    }catch(error){
        return NextResponse.json({error: "Error while adding user to database", details: error}, {status: 500});
    }
}

export async function getOfficeHoursSchedule(access_token : string, courseId : string){
    const supabase = await initialize({access_token});

    if (!supabase) {
        throw new Error("Supabase client is not initialized");
    }

    if(courseId == null){
        throw new Error("Course id is null");
    }

    try{
        const {data: officeHoursSchedule, error: scheduleError} = await supabase
        .from("schedules")
        .select('*')
        .eq('class', courseId);

        if(scheduleError){
            throw new Error("Error while fetching office hours schedule");
        }

        return officeHoursSchedule;

    }catch(error){
        console.error("Error fetching office hours schedule:", error);
        throw error;
    }
}

export const getCourseId = async (courseName : string, courseCode : string, access_token : string) => {
    const supabase = await initialize({access_token});

    if (!supabase) {
        throw new Error("Supabase client is not initialized");
    }

    try{
        const {data: course, error: courseError} = await supabase
        .from("classes")
        .select('id')
        .eq('name', courseName)
        .eq('code', courseCode)
        .single();

        if(course == null){
            return null
        }

        if(courseError){
            throw new Error("Error while fetching course id");
        }

        return course.id;
    }catch(error){
        console.error("Error fetching course id:", error);
        throw error;
    }
}

// export async function pushUserCourses({userId, user_courses, access_token}: {access_token: string, userId: string, user_courses: Array<string>}){
//     const courseId = uuid();
//     await initialize({access_token});
//     const supabase  = getSupabaseClient();

//     if (!supabase) {
//         return NextResponse.json({error: "Supabase client is not initialized"}, {status: 500});
//     }

//     try{
//         user_courses.forEach(async (course: any) => {
//             const {data: existingCourses, error: courseError} = await supabase
//             .from("user_courses")
//             .select(course.id)
//         });
        

//     }catch(error){
//         return NextResponse.json({error: "Error while adding user courses to database", details: error}, {status: 500});
//     }


// }