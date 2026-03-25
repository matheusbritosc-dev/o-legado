import { NextResponse } from "next/server";
import Stripe from "stripe";

const PLANS: Record<string, { amount: number; name: string; interval?: "month" | "year" }> = {
  base_mensal: { amount: 4900, name: "Legado – Apoio Base Mensal", interval: "month" },
  membro_anual: { amount: 50000, name: "Legado – Membro Fundadora Anual", interval: "year" },
};

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });

    const { plan } = await req.json();
    const chosen = PLANS[plan];
    if (!chosen) return NextResponse.json({ error: "Plano inválido" }, { status: 400 });

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: chosen.name },
            unit_amount: chosen.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/assine?canceled=true`,
      payment_method_types: ["card", "boleto"],
      locale: "pt-BR",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
