"use client";

import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";

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
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");

  // Carregar eventos do banco
  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map((item: any) => ({
            id: item.id,
            title: `Consulta — ${item.patient}`,
            start: new Date(item.start),
            end: new Date(item.end),
            patient: item.patient,
          }))
        );
      });
  }, []);

  // Criar novo agendamento
  const handleAddEvent = async () => {
    if (!newTitle || !selectedSlot) return;
    const newEvent = {
      patient: newTitle,
      start: selectedSlot.start,
      end: selectedSlot.end,
    };

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const saved = await res.json();

    setEvents([
      ...events,
      {
        id: saved.id,
        title: `Consulta — ${saved.patient}`,
        start: new Date(saved.start),
        end: new Date(saved.end),
      },
    ]);

    setNewTitle("");
    setSelectedSlot(null);
  };

  // Editar evento existente
  const handleEditEvent = async () => {
    if (!selectedEvent || !newTitle) return;

    const updated = {
      id: selectedEvent.id,
      patient: newTitle,
      start: selectedEvent.start,
      end: selectedEvent.end,
    };

    const res = await fetch("/api/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    const saved = await res.json();

    setEvents(
      events.map((e) =>
        e.id === saved.id
          ? {
              ...e,
              title: `Consulta — ${saved.patient}`,
              patient: saved.patient,
            }
          : e
      )
    );

    setNewTitle("");
    setSelectedEvent(null);
  };

  // Excluir evento
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    await fetch("/api/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedEvent.id }),
    });

    setEvents(events.filter((e) => e.id !== selectedEvent.id));
    setSelectedEvent(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Agenda</h2>
      <p className="text-gray-600 mb-6">
        Clique em um horário para adicionar uma consulta ou em uma existente para editar.
      </p>

      <div className="bg-white p-4 rounded-2xl shadow">
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slot: SlotInfo) => setSelectedSlot(slot)}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setNewTitle(event.patient);
          }}
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
      {selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Nova consulta</h3>

            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              placeholder="Nome do paciente"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

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
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Editar consulta</h3>

            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Excluir
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditEvent}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
