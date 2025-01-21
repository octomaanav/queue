'use server'

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-option";
import { initialize } from "../../../supabase";
import { v4 as uuid } from "uuid";

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

export async function JoinQueue(office_hours_id: string) {
    try {
      const id = uuid();
      const session = await getServerSession(authOptions);
      const access_token = session?.user?.accessToken;
      const userID = session?.user?.id;
  
      if (!access_token || !session) {
        throw new Error("Session is invalid or access token is missing");
      }
  
      const supabase = await initialize({ access_token });
      if (!supabase) {
        throw new Error("Supabase client is not initialized");
      }
  
      const queue = await getQueue(office_hours_id);
  
      if (!queue) {
        throw new Error("Error while fetching queue");
      }
  
      if (!Array.isArray(queue)) {
        throw new Error("Invalid queue data");
      }
  
      if (queue.find((entry: any) => entry.student === userID)) {
        return { student: userID, position: queue.find((entry: any) => entry.student === userID).position };
      }
      const position = queue.length + 1;
      const { data, error } = await supabase
        .from("queue")
        .insert([
          {
            id: id,
            office_hours: office_hours_id,
            student: userID,
            position,
          },
        ]);
  
      if (error) {
        throw new Error("Error while joining the queue");
      }
  
      return { id, student: userID, position, office_hours:office_hours_id }; // Return raw data
    } catch (error : any) {
      throw new Error(`Error while joining queue: ${error.message}`);
    }
  }
  

export async function getQueueEntry(office_hours_id : string){
    try{
        const session = await getServerSession(authOptions);
        const userID = session?.user?.id;
        const access_token = session?.user?.accessToken
        if(!access_token || !session){
            throw new Error("Session is invalid or access token is missing");
        }
        const supabase = await initialize({ access_token });
        if (!supabase) {
            throw new Error("Supabase client is not initialized");
        }
        const {data, error} = await supabase
        .from('queue')
        .select('*')
        .eq('office_hours', office_hours_id)
        .eq('student', userID)
        .single();

        if(data == null){
            return null
        }
        if(error){
            throw new Error("Error while fetching queue entry");
        }
        return data;
    }catch{
        throw new Error("Error while checking if queue entry exists");
    }
}

export async function leaveQueue(office_hours : string){
  try {
    const session = await getServerSession(authOptions);
    const access_token = session?.user?.accessToken;
    const userId = session?.user?.id;
    if (!access_token || !session) {
      throw new Error("Session is invalid or access token is missing");
    }
    const supabase = await initialize({ access_token });
    if (!supabase) {
      throw new Error("Supabase client is not initialized");
    }
    const entry = await getQueueEntry(office_hours);
    if (!entry) {
      throw new Error("User is not in the queue");
    }
    
    const { data, error } = await supabase
      .from("queue")
      .delete()
      .eq("office_hours", office_hours)
      .eq("student", userId)
    
    if (error) {
      throw new Error("Error while removing the user from the queue");
    }
    const verify = await getQueueEntry(office_hours);
    
    if (verify) {
      throw new Error("Error while removing the user from the queue");
    }
    return true

  } catch (error : any) {
    throw new Error(`Error while removing the user from the queue: ${error.message}`);
  }
}