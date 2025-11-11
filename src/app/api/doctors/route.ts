import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const doctors = await prisma.doctor.findMany();
  return NextResponse.json(doctors);
}

export async function POST(request: Request) {
  const data = await request.json();
  const doctor = await prisma.doctor.create({
    data: {
      name: data.name,
      specialty: data.specialty,
    },
  });
  return NextResponse.json(doctor);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
