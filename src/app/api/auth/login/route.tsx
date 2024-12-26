import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.AUTOLAB_CLIENT_ID;
  const redirectUri = process.env.AUTOLAB_REDIRECT_URI
  const authUrl = `${process.env.AUTOLAB_AUTHORIZE_ENDPOINT}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user_info user_courses`;

  return NextResponse.redirect(authUrl);
}
