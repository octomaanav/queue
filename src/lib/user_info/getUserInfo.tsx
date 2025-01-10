'use server'

import { cookies } from "next/headers";
import { NextResponse } from "next/server"


export async function getUserInfo({access_token}: {access_token: string}){
    const response = await fetch(process.env.AUTOLAB_USER_ENDPOINT || '', {
        method: "GET",
        headers:{
            Authorization: `Bearer ${access_token}`
        }
    })
    const userInfo = await response.json();
    if(!response.ok){
        return NextResponse.json({ error: "Error while getting user data", details: userInfo}, { status: 500 });
    }

    return userInfo;
}

export async function getUserCoursesFromAutolab({access_token}:{access_token : string}){
    try{
        const cookieStore = await cookies();
        const response = await fetch(process.env.AUTOLAB_COURSE_ENDPOINT || '',{
            method:"GET",
            headers:{
                Authorization : `Bearer ${access_token}`
            }
        })
    
        const userCourses = await response.json()
        if(!response.ok){
            return NextResponse.json({error : "Error while getting user courses", details: userCourses}, { status: 500 })
        }

        cookieStore.set("user_courses", JSON.stringify(userCourses), {
            maxAge: 60*60*2,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/"
        })
        return userCourses
    }catch(error){
        return NextResponse.json({error : "Error while getting user courses", details: error}, { status: 500 })
    }
}

export async function getUserCoursesFromCookies(){
    try{
        const cookieStore = await cookies();
        const user_courses = cookieStore.get("user_courses")?.value;
        const access_token = cookieStore.get("access_token")?.value;
        if(user_courses){
            return JSON.parse(user_courses);
        }
        else if(access_token){
            const user_courses = await getUserCoursesFromAutolab({access_token});
            return user_courses;
        }
        return []

    }catch(error){
        return NextResponse.json({ error: "Error while getting user courses from cookies", details: error}, { status: 500 });
    }
}