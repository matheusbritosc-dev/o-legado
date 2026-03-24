import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";
    
    // O endpoint FastAPI /auth/login espera JSON com campos "email" e "senha"
    const backendRes = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha: password }),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const data = await backendRes.json();
    const token = data.access_token;

    // Cria a resposta e seta o Cookie HttpOnly no navegador do usuário
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    response.cookies.set({
      name: "legado_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;

  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
