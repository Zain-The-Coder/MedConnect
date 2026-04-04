import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    const upperStatus = status?.toUpperCase();

    if (!upperStatus || !validStatuses.includes(upperStatus)) {
      return NextResponse.json(
        { errorMessage: "Invalid status. Must be one of: pending, confirmed, completed, cancelled" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: upperStatus as any },
      include: {
        doctor: { include: { user: { select: { name: true, email: true } } } },
        patient: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    return NextResponse.json(
      {
        message: "Appointment status updated successfully",
        appointment: {
          id: appointment.id,
          patientId: appointment.patientId,
          patientName: appointment.patient.user.name,
          patientEmail: appointment.patient.user.email,
          doctorId: appointment.doctorId,
          doctorName: appointment.doctor.user.name,
          date: appointment.date.toISOString().split("T")[0],
          time: appointment.timeSlot,
          status: appointment.status.toLowerCase(),
          reason: appointment.symptoms,
          notes: appointment.notes,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: { select: { name: true, email: true } } } },
        patient: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { errorMessage: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      appointment: {
        id: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patient.user.name,
        patientEmail: appointment.patient.user.email,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctor.user.name,
        date: appointment.date.toISOString().split("T")[0],
        time: appointment.timeSlot,
        status: appointment.status.toLowerCase(),
        reason: appointment.symptoms,
        notes: appointment.notes,
        type: appointment.type,
        prescription: appointment.prescription,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
