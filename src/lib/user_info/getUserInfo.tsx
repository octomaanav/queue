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

export async function getUserCourses({access_token}:{access_token : string}){
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

    return userCourses
}
