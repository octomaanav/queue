import { setAuthStatus } from "@/lib/helper/setAuthStatus";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
    try{
        const response = NextResponse.json({ message: "Logged out successfully" });
        const cookie_store = await cookies()
        cookie_store.delete("access_token");
        cookie_store.delete("user_courses");
        await setAuthStatus("unauthorized");
        // cookie_store.set("access_token", "", {
        //     maxAge: 0,
        //     path: "/",
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        // });

        // cookie_store.set("user_courses", "", {
        //     maxAge: 0,
        //     path: "/",
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        // });
        return response;
    }catch(error){
        return NextResponse.json({ message: "Error while logging out" }, { status: 500 });
    }
}


