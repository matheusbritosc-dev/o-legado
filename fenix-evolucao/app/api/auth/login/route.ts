import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // MODO DEMO — Acesso instantâneo sem esperar backend
    const demoToken = Buffer.from(
      JSON.stringify({
        sub: "demo-user-001",
        email: email,
        mode: "demo",
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    ).toString("base64");

    const response = NextResponse.json(
      { success: true, mode: "demo" },
      { status: 200 }
    );

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

  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
