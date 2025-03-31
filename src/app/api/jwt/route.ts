import jwt from "jsonwebtoken";
import crypto from "crypto";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    
    const body = await req.json();
    const { access_token } = body;
    
    
    if (!access_token) {
        return NextResponse.json(
            { error: "Access token not provided" },
            { status: 400 }
        );
    }
    try{
        const autolabResponse = await fetch(process.env.AUTOLAB_USER_ENDPOINT || '', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!autolabResponse.ok) {
            const error = await autolabResponse.json();
            return NextResponse.json(
                { error: "Error while getting user data", details: error },
                { status: 500 }
            );
        }

        const userData = await autolabResponse.json();

        const jwtPayload = {
            sub: userData.email,
            email: userData.email,
            phone: "",
            aud: "authenticated",
            role: "authenticated",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 7200 * 60,
            aal: "aal1",
            session_id: crypto.randomUUID(),
          };

        const supabase_jwt = jwt.sign(jwtPayload,process.env.JWT_SECRET|| '');

        return NextResponse.json({supabase_jwt});


    }catch(error){
        return NextResponse.json({ error: "Error while generating jwt", details:error}, { status: 500 });
    }
    
}

