import { NextResponse } from "next/server";
import { prisma } from "../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");
    const userRole = searchParams.get("role");

    if (type === "doctors") {
      const doctors = await prisma.user.findMany({
        where: { role: "DOCTOR" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          doctor: {
            select: {
              specialization: true,
              fee: true,
              isAvailable: true,
            },
          },
        },
      });
      const formattedDoctors = doctors.map((d) => ({
        id: d.id,
        username: d.name,
        email: d.email,
        role: d.role,
        specialization: d.doctor?.specialization,
        fee: d.doctor?.fee,
        isAvailable: d.doctor?.isAvailable,
      }));
      return NextResponse.json({ doctors: formattedDoctors });
    }

    if (userId && userRole === "patient") {
      const patient = await prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient) {
        return NextResponse.json({ appointments: [] });
      }
      const appointments = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: { include: { user: { select: { name: true, email: true } } } },
          patient: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { date: "desc" },
      });
      const formatted = appointments.map((a) => ({
        id: a.id,
        patientId: a.patientId,
        patientName: a.patient.user.name,
        patientEmail: a.patient.user.email,
        doctorId: a.doctorId,
        doctorName: a.doctor.user.name,
        date: a.date.toISOString().split("T")[0],
        time: a.timeSlot,
        status: a.status.toLowerCase(),
        reason: a.symptoms,
        notes: a.notes,
        type: a.type,
        prescription: a.prescription,
      }));
      return NextResponse.json({ appointments: formatted });
    }

    if (userId && userRole === "doctor") {
      const doctor = await prisma.doctor.findUnique({
        where: { userId },
      });
      if (!doctor) {
        return NextResponse.json({ appointments: [], patients: [] });
      }
      
      // Get appointments
      const appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: {
          doctor: { include: { user: { select: { name: true, email: true } } } },
          patient: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { date: "desc" },
      });
      
      // Get unique patients assigned to this doctor
      const patientIds = [...new Set(appointments.map(a => a.patientId))];
      const patients = await prisma.patient.findMany({
        where: { id: { in: patientIds } },
        include: {
          user: { select: { name: true, email: true } },
        },
      });
      
      const formattedAppointments = appointments.map((a) => ({
        id: a.id,
        patientId: a.patientId,
        patientName: a.patient.user.name,
        patientEmail: a.patient.user.email,
        doctorId: a.doctorId,
        doctorName: a.doctor.user.name,
        date: a.date.toISOString().split("T")[0],
        time: a.timeSlot,
        status: a.status.toLowerCase(),
        reason: a.symptoms,
        notes: a.notes,
        type: a.type,
        prescription: a.prescription,
      }));
      
      const formattedPatients = patients.map((p) => ({
        id: p.id,
        name: p.user.name,
        email: p.user.email,
        dateOfBirth: p.dateOfBirth?.toISOString().split("T")[0] || null,
        bloodGroup: p.bloodGroup,
      }));
      
      return NextResponse.json({ appointments: formattedAppointments, patients: formattedPatients });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: { include: { user: { select: { name: true, email: true } } } },
        patient: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: { date: "desc" },
    });
    const formatted = appointments.map((a) => ({
      id: a.id,
      patientId: a.patientId,
      patientName: a.patient.user.name,
      patientEmail: a.patient.user.email,
      doctorId: a.doctorId,
      doctorName: a.doctor.user.name,
      date: a.date.toISOString().split("T")[0],
      time: a.timeSlot,
      status: a.status.toLowerCase(),
      reason: a.symptoms,
      notes: a.notes,
      type: a.type,
      prescription: a.prescription,
    }));
    return NextResponse.json({ appointments: formatted });
  } catch (e: any) {
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, doctorId, date, time, reason } = body;

    if (!patientId || !doctorId || !date || !time) {
      return NextResponse.json(
        { errorMessage: "Missing required fields" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: patientId },
    });
    if (!patient) {
      return NextResponse.json(
        { errorMessage: "Patient not found" },
        { status: 404 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: doctorId },
    });
    if (!doctor) {
      return NextResponse.json(
        { errorMessage: "Doctor not found" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        date: new Date(date),
        timeSlot: time,
        symptoms: reason || null,
        status: "PENDING",
        type: "IN_PERSON",
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    return NextResponse.json(
      {
        message: "Appointment created successfully",
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
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { errorMessage: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
