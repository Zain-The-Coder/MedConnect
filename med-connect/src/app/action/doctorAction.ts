"use server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function saveDoctorProfile(data: any) {
  try {
    const response = await prisma.doctor.create({
      data: {
        specialization: data.specialization,
        qualifications: data.qualifications,
        experience: parseInt(data.experience),
        fee: parseInt(data.fee),
        isAvailable: data.isAvailable,
        user: {
          create: {
            name: "Test Doctor",
            email: `doc${Math.random()}@test.com`,
            role: "DOCTOR"
          }
        }
      },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: "Database error" }
  }
}