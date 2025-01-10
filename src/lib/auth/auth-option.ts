import { Provider } from "@radix-ui/react-tooltip";
import { NextAuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";

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
            redirect_uri: process.env.AUTOLAB_REDIRECT_URI,
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
    session:{
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }) {
          if (account) {
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
            token.expiresAt = Date.now() + (account.expires_in as number) * 1000;
          }
          return token;
        },
        async session({ session, token }) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.expiresAt = token.expiresAt;
          return session;
        },
      },
}