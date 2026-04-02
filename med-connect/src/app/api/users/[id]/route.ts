import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    const validRoles = ["ADMIN", "DOCTOR", "PATIENT"];
    const upperRole = role?.toUpperCase();

    if (!upperRole || !validRoles.includes(upperRole)) {
      return NextResponse.json(
        { errorMessage: "Invalid role. Must be one of: admin, doctor, patient" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id },
      data: { role: upperRole as any },
    });

    if (upperRole === "DOCTOR") {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { userId: id },
      });
      if (!existingDoctor) {
        await prisma.doctor.create({
          data: {
            userId: id,
            specialization: "General",
            qualifications: "",
            experience: 0,
            fee: 0,
          },
        });
      }
    }

    if (upperRole === "PATIENT") {
      const existingPatient = await prisma.patient.findUnique({
        where: { userId: id },
      });
      if (!existingPatient) {
        await prisma.patient.create({
          data: { userId: id },
        });
      }
    }

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
