'use client'

import { ListEnd, Home, MessageSquareQuote, UserRoundPen, Book, BookOpen } from "lucide-react"
import LOGO from "../../public/next.svg"
import {
  Sidebar,
  SidebarContent,
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
import { div } from "framer-motion/client"
import { Skeleton } from "./ui/skeleton"
import { getUserCoursesFromCookies } from "@/lib/user_info/getUserInfo"

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
    </Sidebar>
  )
}
