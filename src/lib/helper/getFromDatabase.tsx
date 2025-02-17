'use server'

import {v4 as uuid} from 'uuid';
import { NextResponse } from "next/server";
import { initialize } from '../../../supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth-option';

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



        const {data, error : insertError} = await supabase
        .from('users')
        .insert([{id: userId, name: name, email: email}])

        if(insertError){
            return NextResponse.json({error: "Error while inserting user", details: insertError}, {status: 500});
        }

        return userId;
        
    }catch(error){
        return NextResponse.json({error: "Error while adding user to database", details: error}, {status: 500});
    }
}

export async function getUserFromDatabase(userId : string){
    const session = await getServerSession(authOptions);
    const access_token = session?.user?.accessToken

    if(!access_token || !session){
        return NextResponse.json({error: "Session is invalid or access token is missing"}, {status: 500});
    }

    const supabase = await initialize({access_token});

    if (!supabase) {
        return NextResponse.json({error: "Supabase client is not initialized"}, {status: 500});
    }

    try{
        const {data: user, error: userError} = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

        if(userError){
            return NextResponse.json({error: "Error while fetching user", details: userError}, {status: 500});
        }

        return user;

    }catch(error){
        return NextResponse.json({error: "Error while fetching user", details: error}, {status: 500});
    }
}

export async function getOfficeHoursSchedule(courseId : string){
    const session = await getServerSession(authOptions);
    const access_token = session?.user?.accessToken
    if(!access_token || !session){
        throw new Error("Session is invalid or access token is missing");
    }
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

export const getCourseId = async (courseName : string, courseCode : string) => {
    const session = await getServerSession(authOptions);
    const access_token = session?.user?.accessToken
    if(!access_token || !session){
        throw new Error("Session is invalid or access token is missing");
    }
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

export const getOfficeHoursEntry = async (officeHoursId : string) => {
    const session = await getServerSession(authOptions);
    const access_token = session?.user?.accessToken
    
    if(!access_token || !session){
        throw new Error("Session is invalid or access token is missing");
    }

    const supabase = await initialize({access_token});

    if (!supabase) {
        throw new Error("Supabase client is not initialized");
    }

    if(officeHoursId == null){
        return null
    }
    try{
        const {data: officeHoursEntry, error: entryError} = await supabase
        .from("schedules")
        .select('*')
        .eq('id', officeHoursId)
        .single();
        
        if(officeHoursEntry == null){
            return null
        }
        
        if(entryError){
            throw new Error("Error fetching office hours entry");
        }
        return officeHoursEntry;

    }catch(error){
        throw new Error("Something went wrong while getting office hours entry");
    }

}

export const getCourseName = async (courseId : string) => {
    const session = await getServerSession(authOptions);
    const access_token = session?.user?.accessToken
    if(!access_token || !session){
        throw new Error("Session is invalid or access token is missing");
    }

    const supabase = await initialize({access_token});

    if (!supabase) {
        throw new Error("Supabase client is not initialized");
    }

    if(courseId == null){
        return null
    }
    try{
        const {data: officeHoursEntry, error: entryError} = await supabase
        .from("classes")
        .select('*')
        .eq('id', courseId)
        .single();

        
        if(officeHoursEntry == null){
            return null
        }
        
        if(entryError){
            throw new Error("Error fetching office hours entry");
        }
        return officeHoursEntry;

    }catch(error){
        throw new Error("Something went wrong while getting the course name");
    }
}