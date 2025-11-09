import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const appointments = await prisma.appointment.findMany();
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const data = await request.json();
  const appointment = await prisma.appointment.create({
    data: {
      patient: data.patient,
      start: new Date(data.start),
      end: new Date(data.end),
    },
  });
  return NextResponse.json(appointment);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const updated = await prisma.appointment.update({
    where: { id: data.id },
    data: {
      patient: data.patient,
      start: new Date(data.start),
      end: new Date(data.end),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
