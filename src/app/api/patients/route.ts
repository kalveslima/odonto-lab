import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        phone: data.phone,
      },
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Erro no POST /patients:", error);
    return NextResponse.json({ error: "Erro ao criar paciente" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const text = await request.text();
    if (!text) {
      return NextResponse.json({ error: "Corpo da requisição vazio" }, { status: 400 });
    }

    const { id } = JSON.parse(text);
    await prisma.patient.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Erro no DELETE /patients:", error);
    return NextResponse.json({ error: "Erro ao deletar paciente" }, { status: 400 });
  }
}
