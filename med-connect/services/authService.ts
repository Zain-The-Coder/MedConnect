import { hash, compare } from "bcrypt";

import { prisma } from "../src/app/api/lib/prisma";
import path from "path";
import fs from "fs";
import { PrismaClient, Role } from "@prisma/client"; // Prisma ka apna enum import karo

export type UserRole = "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";

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


// 2. Verify Password (Purana logic, same rahega)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// 3. Get User By Email (Ab Database se check karega)
export async function getByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

// 4. Get User By ID
export async function getById(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

// 5. Save Data (Signup Logic - Modified to handle both)
export async function saveData(name: string, email: string, password: string) {
  const found = await getByEmail(email);

  if (found) {
    throw new Error("User Already Exist");
  }

  const hashedPassword = await hash(password, 12);

  // Transaction: Create User AND Patient profile
  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "PATIENT", // Default Role
      },
    });

    // Automatically create patient profile
    await tx.patient.create({
      data: {
        userId: newUser.id,
      },
    });

    return newUser;
  });
}

export async function updateUserRole(id: string, newRole: UserRole) {
  try {
    await prisma.user.update({
      where: { id: id },
      data: { 
        role: newRole as any ,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

// 7. Get All Doctors (Database filter)
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