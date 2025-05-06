'use client'

import { cn } from "@/lib/utils";
import React, { FC } from "react"
import { ReactNode, CSSProperties } from "react"

interface AnimatedShinyTextProps {
    children: ReactNode;
    className?: string;
    shimmerWidth?: number;
  }

export const AnimateText : FC<AnimatedShinyTextProps> = ({children,className,shimmerWidth=100}) =>
    {
    return (
        <div className="text-center">
            <h1 style={{"--shiny-width": `${shimmerWidth}px`,} as CSSProperties} 
            className={cn(
                "text-7xl text-neutral-600/70 dark:text-neutral-400/70",
         
                // Shine effect
                "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.1,.1,0,1)_infinite]",
         
                // Shine gradient
                "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",
         
                className,
              )}>
                {children}
            </h1>
        </div>
    )
}

