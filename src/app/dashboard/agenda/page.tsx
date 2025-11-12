"use client";

import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Patient {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  start: string;
  end: string;
  patient: Patient;
  doctor?: { id: number; name: string };
}

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function AgendaPage() {
  const [events, setEvents] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Buscar pacientes e agendamentos
  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data: Patient[]) => Array.isArray(data) && setPatients(data))
      .catch(() => setPatients([]));

    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data: Appointment[]) =>
        Array.isArray(data)
          ? setEvents(
              data.map((item) => ({
                ...item,
                start: new Date(item.start).toISOString(),
                end: new Date(item.end).toISOString(),
              }))
            )
          : []
      )
      .catch(() => setEvents([]));
  }, []);

  // 🔍 Filtro de pacientes (autocomplete)
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ➕ Criar novo agendamento
  const handleAddEvent = async () => {
    if (!selectedPatientId || !selectedSlot)
      return alert("Selecione um paciente e um horário!");

    const newEvent = {
      patientId: selectedPatientId,
      doctorId: 1,
      start: selectedSlot.start,
      end: selectedSlot.end,
    };

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const saved: Appointment = await res.json();
    if (!saved?.id) return alert("Erro ao criar consulta");

    setEvents((prev) => [
      ...prev,
      {
        ...saved,
        start: new Date(saved.start).toISOString(),
        end: new Date(saved.end).toISOString(),
      },
    ]);

    setSelectedPatientId(null);
    setSelectedSlot(null);
    setSearchTerm("");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Agenda</h2>

      <div className="bg-white p-4 rounded-2xl shadow">
        <Calendar
          localizer={localizer}
          events={events.map((e) => ({
            ...e,
            title: `Consulta — ${e.patient.name}`,
            start: new Date(e.start),
            end: new Date(e.end),
          }))}
          selectable
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slot) => setSelectedSlot(slot)}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
        />
      </div>

      {/* Modal com animação */}
      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-white rounded-2xl p-6 w-96 shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4">Nova consulta</h3>

            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />

            <div className="max-h-40 overflow-y-auto border rounded-lg mb-4">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`block w-full text-left px-3 py-2 hover:bg-blue-100 transition ${
                    selectedPatientId === p.id ? "bg-blue-200" : ""
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
