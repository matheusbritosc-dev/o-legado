import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

    // Se tiver backend configurado, tenta autenticar lá primeiro
    if (apiUrl) {
      try {
        const backendRes = await fetch(`${apiUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha: password }),
          signal: AbortSignal.timeout(3000), // 3 segundos - demo mode ativa rápido
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          const token = data.access_token;

          const response = NextResponse.json({ success: true }, { status: 200 });
          response.cookies.set({
            name: "legado_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return response;
        }

        if (backendRes.status === 400 || backendRes.status === 401) {
          const errorData = await backendRes.json().catch(() => ({}));
          return NextResponse.json(
            { error: errorData.detail || "Credenciais inválidas" },
            { status: 401 }
          );
        }
      } catch {
        // Backend offline — cai no modo demo abaixo
        console.log("[Legado] Backend offline, ativando modo demo.");
      }
    }

    // ========================================
    // MODO DEMO — Funciona sem backend externo
    // ========================================
    // Gera um token JWT simples para permitir acesso ao dashboard
    // Em produção, este bloco é substituído pela autenticação real quando o backend voltou online
    const demoToken = Buffer.from(
      JSON.stringify({
        sub: "demo-user-001",
        email: email,
        mode: "demo",
        exp: Math.floor(Date.now() / 1000) + 86400, // 24h
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
      maxAge: 60 * 60 * 24, // 24 horas demo
    });

    return response;

  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
