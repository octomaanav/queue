import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth-option"; // Keep auth logic in a separate file for reusability

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
