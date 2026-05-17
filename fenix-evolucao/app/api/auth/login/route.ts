import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://api.shieldfraud.io";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
