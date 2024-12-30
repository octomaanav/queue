'use server'

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try{
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken");

        if(!accessToken){
            return NextResponse.json({ message: "No access token found" }, { status: 400 });
        }

        const response = await fetch("https://autolab.cse.buffalo.edu/api/v1/user", {
            headers:{
                Authorization: `Bearer ${accessToken.value}`
            }
        });

        const userData = await response.json();
        return NextResponse.json(userData);

    } catch (error) {
        return NextResponse.json({ error: 'Error occurred while retrieving access token', details: error }, { status: 500 });
    }
}