import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { mensagem } = await request.json();
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Configuração de IA ausente." }, { status: 500 });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: `Você é o "Conselheiro do Legado", uma IA especializada em proteção à mulher e combate à violência doméstica. 
            Sua missão é:
            1. Acolher a vítima com empatia e sem julgamentos.
            2. Fornecer orientações baseadas na Lei Maria da Penha (Lei 11.340/2006).
            3. Priorizar a segurança física da usuária acima de tudo.
            4. Se identificar risco imediato, orientar o acionamento do SOS no sistema ou ligar para o 180/190.
            5. Manter as respostas concisas, diretas e protetoras. 
            Nunca salve dados pessoais. Jamais saia do personagem de Conselheiro do Legado.`
          },
          {
            role: "user",
            content: mensagem
          }
        ],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("NVIDIA API Error:", errorData);
      throw new Error("Falha na inteligência artificial");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ resposta: aiResponse });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "O Conselheiro está processando outros protocolos no momento. Tente novamente." },
      { status: 500 }
    );
  }
}
