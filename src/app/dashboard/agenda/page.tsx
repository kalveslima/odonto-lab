"use client";

import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function AgendaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Buscar pacientes e agendamentos
  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data);
        else setPatients([]); // fallback se a API retornar algo inesperado
      })
      .catch(() => setPatients([]));

    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(
            data.map((item: any) => ({
              id: item.id,
              title: `Consulta — ${item.patient?.name || "Paciente desconhecido"}`,
              start: new Date(item.start),
              end: new Date(item.end),
              patientId: item.patient?.id,
            }))
          );
        } else {
          setEvents([]);
        }
      })
      .catch(() => setEvents([]));
  }, []);

  // 🔹 Criar novo agendamento
  const handleAddEvent = async () => {
    if (!selectedPatientId || !selectedSlot)
      return alert("Selecione um paciente antes de salvar.");

    const newEvent = {
      patientId: selectedPatientId,
      doctorId: 1, // pode ajustar depois se quiser escolher o médico
      start: selectedSlot.start,
      end: selectedSlot.end,
    };

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const saved = await res.json();
    if (saved.error) return alert(saved.error);

    setEvents([
      ...events,
      {
        id: saved.id,
        title: `Consulta — ${saved.patient.name}`,
        start: new Date(saved.start),
        end: new Date(saved.end),
        patientId: saved.patient.id,
      },
    ]);

    setSelectedPatientId(null);
    setSelectedSlot(null);
    setSearchTerm("");
  };

  // 🔍 Filtrar pacientes dinamicamente
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Agenda</h2>

      <div className="bg-white p-4 rounded-2xl shadow">
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slot: SlotInfo) => setSelectedSlot(slot)}
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

      {/* Modal de criação */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 w-96 shadow-xl relative"
            >
              <h3 className="text-xl font-semibold mb-4">Nova consulta</h3>

              <input
                type="text"
                placeholder="Digite o nome do paciente..."
                className="w-full border rounded p-2 mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Lista de pacientes filtrada */}
              <div className="max-h-40 overflow-y-auto border rounded mb-4">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setSearchTerm(p.name);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                        selectedPatientId === p.id ? "bg-blue-200" : ""
                      }`}
                    >
                      {p.name} — {p.phone}
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-gray-500 text-sm">Nenhum paciente encontrado.</p>
                )}
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
      </AnimatePresence>
    </div>
  );
}
