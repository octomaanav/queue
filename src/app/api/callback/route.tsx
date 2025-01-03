'use server'

import { NextRequest, NextResponse } from "next/server";
import { pushUserToDataBase } from "@/lib/supabase/userHelper";
// import { supabase } from "../../../../supabase";
import { initializeSupabaseClient, fetchSupabaseJWT, initialize, getSupabaseClient } from "../../../../supabase";

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if(!code){
            return NextResponse.json({ message: "No code received" }, { status: 400 });
        } 

        const tokenResponse = await fetch("https://autolab.cse.buffalo.edu/oauth/token",{
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: "https://localhost:3000/api/callback",
                client_id: process.env.AUTOLAB_CLIENT_ID|| '',   
                client_secret: process.env.AUTOLAB_CLIENT_SECRET || '',
            })
        })

        if(!tokenResponse.ok){
            const error = await tokenResponse.json();
            return NextResponse.json({ error: "Error while getting token", details:error}, { status: 500 });
        }

        const tokenData = await tokenResponse.json();
        const access_token = tokenData.access_token;

        const userResponse = await fetch(process.env.AUTOLAB_USER_ENDPOINT || '', {
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        })

        if(!userResponse.ok){
            const error = await userResponse.json();
            return NextResponse.json({ error: "Error while getting user data", details:error}, { status: 500 });
        }

        const userData = await userResponse.json();

        // const jwt = await fetchSupabaseJWT({access_token});

        // return NextResponse.json({jwt}, { status: 200 });

        await initialize({access_token});
        const supabase = getSupabaseClient();

        if (!supabase) {
            return NextResponse.json({ error: "Supabase client is not initialized" }, { status: 500 });
        }
        const {data, error} = await supabase.from('users').select('*');
        return NextResponse.json({data, error}, { status: 200 });


        // await initialize({access_token});

        // const supabase = getSupabaseClient();


        await pushUserToDataBase({
            name: `${userData.first_name} ${userData.last_name}`,
            email: userData.email,
            access_token
        });

        
        const response = NextResponse.redirect('https://localhost:3000/dashboard');
        response.cookies.set("accessToken", access_token, {
            maxAge: 60*60*20,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });
        return response;
    }

    catch(error){
        return NextResponse.json({ error: "Error occurred while getting authentication code", details : error }, { status: 500 });
    }
}
