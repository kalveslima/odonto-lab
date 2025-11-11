import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📋 GET - listar todos os agendamentos
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, doctor: true },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET /api/appointments ERROR:", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
  }
}

// ➕ POST - criar novo agendamento
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const appointment = await prisma.appointment.create({
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        doctor: { connect: { id: data.doctorId } },
        patient: { connect: { id: data.patientId } },
      },
      include: { patient: true, doctor: true },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("POST /api/appointments ERROR:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
  }
}

// ✏️ PUT - atualizar agendamento
export async function PUT(request: Request) {
  try {
    const data = await request.json();

    const updated = await prisma.appointment.update({
      where: { id: data.id },
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        doctor: { connect: { id: data.doctorId } },
        patient: { connect: { id: data.patientId } },
      },
      include: { patient: true, doctor: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/appointments ERROR:", error);
    return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
  }
}

// ❌ DELETE - remover agendamento
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/appointments ERROR:", error);
    return NextResponse.json({ error: "Erro ao deletar agendamento" }, { status: 500 });
  }
}
