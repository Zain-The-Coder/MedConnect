import { NextResponse } from "next/server";
import {saveData} from "../../../../../services/authService.js"

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { errorMessage: "Fields Are Empty" },
        { status: 400 } 
      );
    }

    await saveData(username, email, password);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (e) {
    // 4. Error Handling
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}