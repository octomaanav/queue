'use server'

import React from "react"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request : NextRequest, response : NextResponse){
    const {searchParams} = new URL(request.url)
    const code = searchParams.get("code")
    console.log("code", code)
    
}