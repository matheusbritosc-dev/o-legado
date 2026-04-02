import { NextResponse } from "next/server";

// Acesso direto ao dashboard sem depender de backend
// URL: /api/demo → seta cookie → redireciona pro dashboard
export async function GET(request: Request) {
  const demoToken = Buffer.from(
    JSON.stringify({
      sub: "demo-user-001",
      email: "demo@legado.com",
      mode: "demo",
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  ).toString("base64");

  const url = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: "legado_token",
    value: `demo.${demoToken}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
