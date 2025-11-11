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
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}

// ➕ POST - criar novo agendamento
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 🧩 Validação básica
    if (!data.doctorId || !data.patientId || !data.start || !data.end) {
      return NextResponse.json(
        { error: "Campos obrigatórios: doctorId, patientId, start, end" },
        { status: 400 }
      );
    }

    // ⚙️ Criação no banco
    const appointment = await prisma.appointment.create({
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        doctor: { connect: { id: Number(data.doctorId) } },
        patient: { connect: { id: Number(data.patientId) } },
      },
      include: { patient: true, doctor: true },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("POST /api/appointments ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}

// ✏️ PUT - atualizar agendamento
export async function PUT(request: Request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "O ID do agendamento é obrigatório" },
        { status: 400 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(data.id) },
      data: {
        start: data.start ? new Date(data.start) : undefined,
        end: data.end ? new Date(data.end) : undefined,
        doctor: data.doctorId
          ? { connect: { id: Number(data.doctorId) } }
          : undefined,
        patient: data.patientId
          ? { connect: { id: Number(data.patientId) } }
          : undefined,
      },
      include: { patient: true, doctor: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/appointments ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    );
  }
}

// ❌ DELETE - remover agendamento
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "O ID do agendamento é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.appointment.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error("DELETE /api/appointments ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao deletar agendamento" },
      { status: 500 }
    );
  }
}
