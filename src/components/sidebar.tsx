'use client'

import { ListEnd, Home, MessageSquareQuote, UserRoundPen, Book, BookOpen, ChevronDown, ChevronUp, SquareChevronUp, ChevronsUpDown, History, Bug, LogOut, BadgeAlert, CircleAlert, MoonIcon, SunIcon } from "lucide-react"
import LOGO from "../../public/next.svg"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import React, { useEffect } from "react"
import { div, tr } from "framer-motion/client"
import { Skeleton } from "./ui/skeleton"
import { getUserCoursesFromCookies } from "@/lib/user_info/getUserInfo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar } from "./ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"

interface UserCourse{
  auth_level:string,
  display_name:string,
  name:string,
}

const menu_items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Queue",
    url: "#",
    icon: ListEnd,
  },
  {
    title: "Feedback",
    url: "#",
    icon: MessageSquareQuote,
  },
  {
    title: "Profile",
    url: "#",
    icon: UserRoundPen,
  },
]

export function AppSidebar() {
  const [courses, setCourses] = React.useState<UserCourse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { theme, setTheme } = useTheme();

  // useEffect(()=>{
  //   const fetchCourses = async () => {
  //     try{
  //       setLoading(true);
  //       const response = await fetch("/api/course");
  //       if(!response.ok){
  //         throw new Error("Error while fetching user courses");
  //       }

  //       const courseData = await response.json();
  //       setCourses(Array.isArray(courseData) ? courseData : []);

  //     }catch(error){
  //       console.error("Error while getting user courses", error);
  //   }finally{
  //     setLoading(false);
  //   }
  // }
  //   fetchCourses();
  // },[])
  useEffect(() => {
      const fetchUserCourses = async () => {
        try{
          setLoading(true);
          const user_courses = await getUserCoursesFromCookies();
          setCourses(user_courses);
        }catch(error){
          throw new Error("An error occurred while fetching user courses");
      }finally{
        setLoading(false);
      }}
      fetchUserCourses();
    },[])

  const handleLogOut = async () => {
    try{
    const response = await fetch("/api/logout", {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
    });
    if(response.ok){
      window.location.href = "/";
    }else{
      throw new Error("Failed to log out");
    }
    }catch(error){
      throw new Error("Error while logging out");
    }
  }

  const renderCourseSkeleton = () => {
      return Array.from({ length: 6 }).map((i, index) => (
        <Skeleton key={index} className="h-7 rounded-sm" />
      ));
    };

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-center py-2 font-bold">Next Up</h1>
      {/* <Image
            src={LOGO}
            alt="NextUp"
            width={100}
            height={100}
            layout="intrinsic" // Ensure intrinsic size
            className="object-contain" // Ensures the image fills only its intrinsic bounds
          /> */}
      </SidebarHeader>
      <SidebarContent className="px-1">
        <SidebarGroup >
          <SidebarGroupLabel className="text-sm font-semibold">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu_items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
        {courses.length > 0 ? <SidebarGroupLabel className="text-sm font-semibold">Courses</SidebarGroupLabel> : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {loading 
              ? <div className="flex flex-col space-y-2">
                {renderCourseSkeleton()}
                </div>
              : Array.isArray(courses) && courses.length > 0
              ? courses.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={"/"}>
                      <BookOpen />
                      <span>{item.display_name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-10">
              <div className="dark:bg-slate-800 bg-gray-300 p-1.5 rounded-full">
                <span className="font-semibold">MS</span>
              </div>
              <h1 className="font-semibold">Manav Sharma</h1>
                <ChevronsUpDown style={{ width: '20px', height: '20px' }} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
          <DropdownMenuGroup>
            {/* <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <div className="bg-slate-800 p-1.5 rounded-full">
                  <span className="font-semibold">MS</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <h1 className="text-[11px]">Manav Sharma</h1>
                  <p className="text-[10px]">manavsha@buffalo.edu</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/> */}
                <DropdownMenuItem>
                    <MessageSquareQuote/>
                    Feedback
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CircleAlert size={16} />
                    Report Issue
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                Change Theme
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogOut}>
                    <LogOut size={16} />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
