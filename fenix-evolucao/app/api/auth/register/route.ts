import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha } = body;

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

    // Tenta registrar no backend real se estiver online
    if (apiUrl) {
      try {
        const backendRes = await fetch(`${apiUrl}/api/v1/auth/registrar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
          signal: AbortSignal.timeout(8000),
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json({ success: true, user: data }, { status: 201 });
        }

        if (backendRes.status === 400) {
          const errorData = await backendRes.json().catch(() => ({}));
          return NextResponse.json(
            { error: errorData.detail || "Erro no registro" },
            { status: 400 }
          );
        }
      } catch {
        console.log("[Legado] Backend offline para registro, ativando modo demo.");
      }
    }

    // MODO DEMO — Registro simulado
    return NextResponse.json(
      {
        success: true,
        mode: "demo",
        user: {
          id: "demo-" + Date.now(),
          nome,
          email,
          pontos_gamificacao: 0,
          nivel: 1,
          trilhas_concluidas: [],
          criado_em: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register route error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
