import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { errorMessage: "Email aur password zaroori hain!" },
        { status: 400 }
      );
    }

    console.log("Login attempt for:", email);

    return NextResponse.json(
      { message: "Login successful!" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Server mein masla hai" },
      { status: 500 }
    );
  }
}