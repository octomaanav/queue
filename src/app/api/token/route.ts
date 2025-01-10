'use server'

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try{
        const cookieStore = await cookies();
        const access_token = cookieStore.get("access_token");

        if(!access_token){
            return "null"
            // return NextResponse.json({ message: "No access token found" }, { status: 400 });
        }
        return NextResponse.json(access_token.value);

    } catch (error) {
        return NextResponse.json({ error: 'Error occurred while retrieving access token', details: error }, { status: 500 });
    }
}