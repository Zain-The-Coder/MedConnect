import fs from "fs";
import path from "path";

type User = {
  id: number;
  email: string;
  password: string;
};

const filePath = path.join(process.cwd(), "src", "data", "users.json");

export function getAllUsers(): User[] {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function getById(id: number | string): User | undefined {
  const data = getAllUsers();
  const eachData = data.find((p) => p.id === Number(id));
  return eachData;
}

export function saveData(email: string, password: string): void {
  const data = getAllUsers();

  const found = data.find((user) => user.email === email);

  if (found) {
    throw new Error("User Already Exist");
  }

  data.push({
    id: data.length + 1,
    email,
    password,
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}