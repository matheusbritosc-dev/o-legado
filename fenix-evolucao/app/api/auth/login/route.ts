import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // O frontend envia {email, password}, o backend espera {email, senha}
    const backendPayload = {
      email: body.email,
      senha: body.password,
    };

    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || "E-mail ou senha incorretos." },
        { status: res.status }
      );
    }

    // Retorna o token para o frontend salvar no localStorage
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no proxy de login:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor." },
      { status: 500 }
    );
  }
}
