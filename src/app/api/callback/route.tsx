'use server'

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        console.log("code", code);

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
        const accessToken = tokenData.access_token;
        
        const response = NextResponse.redirect('https://localhost:3000/dashboard');
        response.cookies.set("accessToken", accessToken, {
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
