'use client'

import Image from "next/image"
import React from "react"
import LOGO from '../../public/logo.png'
import ModeToggle from "./mode-toggle"
import { Button } from "./ui/button"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center pr-4 h-20">
            <Link href="/">
                <div className="relative w-[150px] h-[200px]">
                    <Image 
                        src={LOGO} 
                        alt="logo" 
                        layout="fill" 
                        objectFit="contain" 
                        priority 
                    />
                </div>
            </Link>
            <div className="flex gap-2">
                <ModeToggle />
                <Button variant={"secondary"} className="font-semibold font-mono">
                    Sign Up
                </Button>
            </div>
        </nav>
    )
}
