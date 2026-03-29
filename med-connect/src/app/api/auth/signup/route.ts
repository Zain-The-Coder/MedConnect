import { NextResponse } from "next/server";
import { saveData } from "../../../../../services/authService";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 2. Validation
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

  } catch (e: any) {
    // 4. Error Handling (TypeScript mein error hamesha 'unknown' ya 'any' hota hai)
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}