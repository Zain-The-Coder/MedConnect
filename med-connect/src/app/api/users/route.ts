import { NextResponse } from "next/server";
import { prisma } from "../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const safeUsers = users.map((u) => ({
      id: u.id,
      username: u.name,
      email: u.email,
      role: u.role ? u.role.toLowerCase() : "patient",
      createdAt: u.createdAt.toISOString(),
    }));
    return NextResponse.json({ users: safeUsers });
  } catch (e: any) {
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
