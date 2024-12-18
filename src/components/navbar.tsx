'use client'

import Image from "next/image"
import React from "react"
import LOGO from '../../public/logo.png'
import ModeToggle from "./mode-toggle"
export default function Navbar(){
    return (
        <nav className="flex justify-between">
            <ModeToggle/>
        </nav>
    )
}