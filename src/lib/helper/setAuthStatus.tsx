'use server'

import { cookies } from "next/headers";

export async function setAuthStatus(status : 'authorized' | 'unauthorized'){
    const cookieStore = await cookies();
    cookieStore.set("authorized_status", status, {
        maxAge: 60*60*5,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
}

export async function getAuthStatus(){
    try{
        const cookieStore = await cookies();
        const status = cookieStore.get("authorized_status")?.value;
        if(status){
            return status;
        }
        return "unauthorized";
    }catch(error){
        console.error("Error while getting auth status", error);
        return "unauthorized";
    }
    
}