'use server'

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-option";
import { initialize } from "../../../supabase";

export async function getQueue(office_hours_id : string){
    try{
        const session = await getServerSession(authOptions);
        const access_token = session?.user?.accessToken
        if(!access_token || !session){
            throw new Error("Session is invalid or access token is missing");
        }
    
        const supabase = await initialize({access_token});
    
    
        if (!supabase) {
            throw new Error("Supabase client is not initialized");
        }
        const {data, error} = await supabase
        .from('queue')
        .select('*')
        .eq('office_hours', office_hours_id);

        if(data == null){
            return null
        }

        if(error){
            throw new Error("Error while fetching queue");
        }

        return data


    }catch(error){
        return NextResponse.json({error: "Error while fetching queue", details: error}, {status: 500});
    }
}