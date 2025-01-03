import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// export const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

let supabase: SupabaseClient | null = null;

export async function fetchSupabaseJWT({access_token} : {access_token : string}){
    
    try{
        const cookieStore = await cookies();
        // const supabase_jwt = cookieStore.get("supabase_jwt");
        // const supabase_jwt_expiry = cookieStore.get("supabase_jwt_expiry");
        // if(supabase_jwt && supabase_jwt_expiry && Date.now() < parseInt(supabase_jwt_expiry.value)){
        //     return supabase_jwt.value
        // }
    

        const jwtResponse = await fetch("https://localhost:3000/api/jwt",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({access_token})
        })

        // const jwtResponse = await fetch("http://localhost:3001/generate-jwt", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ access_token })
        // });

        
        if(!jwtResponse.ok){
            const error = await jwtResponse.json();
            return NextResponse.json({ error: "Error while fetching jwt", details:error}, { status: 500 });
        }

        const jwtData = await jwtResponse.json();

        cookieStore.set("supabase_jwt", jwtData.supabase_jwt, {
            httpOnly: true,
            value: jwtData.supabase_jwt,
            maxAge: 1000 * 60 * 60 * 2,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict"
        });
        cookieStore.set("supabase_jwt_expiry", (Date.now() + 1000 * 60 * 60 * 2).toString(), {
            httpOnly: true,
            value: (Date.now() + 1000 * 60 * 60 * 2).toString(),
            maxAge: 1000 * 60 * 60 * 2,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict"
        })
        
        return jwtData.supabase_jwt

    }catch(error){
        return NextResponse.json({ error: "Error while fetching jwt", details:error}, { status: 500 });
    }
}

export async function initializeSupabaseClient({jwt_token} : {jwt_token : string}){
    try {
        const client = createClient(
          process.env.SUPABASE_URL || "",
          process.env.SUPABASE_KEY || "",
          {
            global: {
              headers: {
                Authorization: `Bearer ${jwt_token}`,
              },
            },
            realtime: {
              params: {
                eventsPerSecond: 10,
              },
            },
          }
        );
        
        // Configure realtime client with auth
        client.realtime.setAuth(jwt_token);
        
        return client;
      } catch (err) {
        console.error("Failed to initialize supabase client:", err);
        throw err;
      }
    
}


export async function initialize({ access_token }: { access_token: string }) {
    // if (supabase) {
    //   return supabase;
    // }
  
    try {
      const jwtToken = await fetchSupabaseJWT({ access_token });
      const client = await initializeSupabaseClient({ jwt_token: jwtToken });
      if (!client) {
        return NextResponse.json({ error: "Error while initializing Supabase client" }, { status: 500 });
      }
      supabase = client;

    } catch (err) {
      return NextResponse.json({ error: "Error while initializing Supabase client", details: err }, { status: 500 });
    }
  }


  export const getSupabaseClient = (): SupabaseClient | null => {
    return supabase;
  };

