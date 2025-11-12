"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Stethoscope } from "lucide-react";

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const today = new Date();

  // 🔹 Buscar dados da API
  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setAppointments(data) : []))
      .catch(() => setAppointments([]));

    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setPatients(data) : []))
      .catch(() => setPatients([]));

    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setDoctors(data) : []))
      .catch(() => setDoctors([]));
  }, []);

  // 🔹 Filtros e contagens
  const todayAppointments = appointments.filter((a) => {
    const date = new Date(a.start);
    return date.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.start) > today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  // 🔹 Animação base
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Painel de Controle</h2>

      {/* Cards de Resumo */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div
          variants={fadeUp}
          className="p-5 bg-white shadow rounded-2xl flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Médicos cadastrados</p>
            <p className="text-2xl font-bold">{doctors.length}</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="p-5 bg-white shadow rounded-2xl flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Pacientes cadastrados</p>
            <p className="text-2xl font-bold">{patients.length}</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="p-5 bg-white shadow rounded-2xl flex items-center gap-4"
        >
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Consultas de hoje</p>
            <p className="text-2xl font-bold">{todayAppointments.length}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Agenda rápida */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="bg-white p-5 rounded-2xl shadow"
      >
        <h3 className="text-lg font-semibold mb-3">📅 Agenda Rápida (Hoje)</h3>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta agendada para hoje.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {todayAppointments.map((a) => (
              <li key={a.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">{a.patient?.name || "Paciente"}</p>
                  <p className="text-sm text-gray-500">
                    {a.doctor?.name || "Médico não informado"}
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  {new Date(a.start).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(a.end).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Próximas consultas */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="bg-white p-5 rounded-2xl shadow"
      >
        <h3 className="text-lg font-semibold mb-3">⏭️ Próximas Consultas</h3>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta futura.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {upcomingAppointments.map((a) => (
              <li key={a.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">{a.patient?.name}</p>
                  <p className="text-sm text-gray-500">
                    {a.doctor?.name || "Médico não informado"}
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  {new Date(a.start).toLocaleDateString("pt-BR")}{" "}
                  {new Date(a.start).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
