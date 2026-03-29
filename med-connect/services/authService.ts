import fs from "fs";
import path from "path";
import { compare, hash } from "bcrypt";

export interface UserData {
  id: number;
  username: string;
  email: string;
  password?: string;
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

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export function getByEmail(email: string): UserData | undefined {
  const data = getAllUsers();
  return data.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getById(id: number | string): UserData | undefined {
  const data = getAllUsers();
  return data.find((p) => p.id === Number(id));
}

// 3. Signup mein password hash karna zaroori hai
export async function saveData(username: string, email: string, password: string): Promise<void> {
  const data = getAllUsers();

  const found = data.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (found) {
    throw new Error("User Already Exist");
  }

  const hashedPassword = await hash(password, 12);

  const newUser: UserData = {
    id: data.length + 1,
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
  };

  data.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}