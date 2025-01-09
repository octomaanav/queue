'use client'

import Image from "next/image"
import React from "react"
import LOGO from '../../public/logo.png'
import ModeToggle from "./mode-toggle"
import { Button } from "./ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Bug, History, LogOut, MessageSquareQuote, MessageSquareWarning } from "lucide-react"
import { div } from "framer-motion/client"

export default function Navbar() {

    const [auth, setAuth] = React.useState(false)

    const handleClick = () =>{
        setAuth((prevAuth) => !prevAuth)
    }

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

                {!auth ? 
                
                <Button variant={"secondary"} className="font-semibold font-mono" onClick={handleClick}>
                    Sign Up
                </Button>
                :

                <div>
                    <Avatar>
                        <AvatarFallback className="font-semibold">
                            MS
                        </AvatarFallback>
                    </Avatar>
                </div>
                }
            </div>
        </nav>
    )
}
