'use client'

import Image from "next/image"
import React, { useEffect } from "react"
import LOGO from '../../public/logo.png'
import ModeToggle from "./mode-toggle"
import { Button } from "./ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { getAuthStatus } from "@/lib/helper/setAuthStatus"

export default function Navbar() {
    const [auth, setAuth] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const status = await getAuthStatus();
                setAuth(status === "authorized");
            } finally {
                setLoading(false);
            }
        }
        fetchAuthStatus();
    }, [])

    const handleClick = async () => {
        window.location.href = "/api/login";
    };

    return (
        <nav className="flex justify-between items-center pr-5 h-20">
            <Link href="/" prefetch={false}>
                <div className="relative w-[150px] h-[200px]">
                    <Image 
                        src={LOGO} 
                        alt="logo" 
                        layout="fill"
                        style={{ objectFit: 'contain' }}
                        sizes="100px"
                    />
                </div>
            </Link>
            
            <div className="flex gap-4 items-center justify-center">
                <ModeToggle />
                {loading ? (
                    <></>
                    // <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                ) : auth ? (
                    <Avatar>
                        <AvatarFallback className="font-semibold">
                            MS
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <Button variant={"secondary"} className="font-semibold font-mono" onClick={handleClick}>
                        Sign Up
                    </Button>
                )}
            </div>
        </nav>
    )
}
