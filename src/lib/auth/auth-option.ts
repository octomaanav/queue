import { NextAuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";
import { cookies } from "next/headers";
import { getUserCoursesFromAutolab, getUserInfo } from "../user_info/getUserInfo";
import { pushUserToDataBase } from "../supabase/userHelper";
import { redirect } from "next/dist/server/api-utils";

interface AutolabProfile {
    first_name: string;
    last_name: string;
    email: string;
  }
  

const autolabProvider: OAuthConfig<AutolabProfile> = {
    id: "autolab",
    name: "Autolab",
    type: "oauth",
    version: "2.0",
    authorization:{
        url: `${process.env.AUTOLAB_AUTHORIZE_ENDPOINT}`,
        params:{
            response_type: "code",
            scope: "user_info user_courses",
            client_id: process.env.AUTOLAB_CLIENT_ID,
            redirect_uri:"https://localhost:3000/api/auth/callback/autolab",
            state: "randomstring",
        }
    },
    token:`${process.env.AUTOLAB_TOKEN_ENDPOINT}`,
    userinfo:{
        url:`${process.env.AUTOLAB_USER_ENDPOINT}`,
    },
    clientId: process.env.AUTOLAB_CLIENT_ID,
    clientSecret: process.env.AUTOLAB_CLIENT_SECRET,
    profile: (profile) => {
        return {
            id: profile.email,
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
        };
    },
}

export const authOptions: NextAuthOptions = {
  providers: [autolabProvider],
  session: { strategy: "jwt" },
  debug: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;

    },
    async jwt({ token, account }) {
      if (account) {
        // Exchange the authorization code for tokens
        if (!account.access_token) {
          throw new Error("Access token is missing");
        }
        const userData = await getUserInfo({ access_token: account.access_token });
        
        // Store user in database
        await pushUserToDataBase({
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          access_token: account.access_token,
        });
  
        const userCourses: string[] = await getUserCoursesFromAutolab({
          access_token: account.access_token,
        });
  
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + 7200 * 1000;
        token.userCourses = userCourses;
      }
  
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.expiresAt = token.expiresAt;
      session.user.courses = token.userCourses as string[];
      return session;
    },
  },
};
