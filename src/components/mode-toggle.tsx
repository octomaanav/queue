'use client'

import { useTheme } from "next-themes"
import React from "react"
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
        <SunIcon className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
        <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
      </Button>
    )
}