import { hash, compare } from "bcrypt";
import type { Prisma } from "@prisma/client";
import { prisma } from "../src/app/api/lib/prisma";
import path from "path";
import fs from "fs";

export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

export interface UserData {
  id: number;
  username: string;
  email: string;
  password?: string;
  role?: UserRole;
  createdAt?: string;
}

const filePath = path.join(process.cwd(), "src", "data", "users.json");

export function getAllUsers(): UserData[] {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Verify Password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// Get User By Email
export async function getByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

// Get User By ID
export async function getById(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

// Signup Logic
export async function saveData(name: string, email: string, password: string) {
  const found = await getByEmail(email);

  if (found) {
    throw new Error("User Already Exist");
  }

  const hashedPassword = await hash(password, 12);

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "PATIENT",
      },
    });

    await tx.patient.create({
      data: {
        userId: newUser.id,
      },
    });

    return newUser;
  });
}

// Update User Role
export async function updateUserRole(id: string, newRole: UserRole) {
  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        role: newRole as any,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Get All Doctors
export async function getAllDoctors() {
  return await prisma.user.findMany({
    where: { role: "DOCTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}