"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Stethoscope } from "lucide-react";

interface Appointment {
  id: number;
  start: string;
  end: string;
  patient?: { id: number; name: string };
  doctor?: { id: number; name: string };
}

interface Patient {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const today = new Date();

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data: Appointment[]) => Array.isArray(data) && setAppointments(data))
      .catch(() => setAppointments([]));

    fetch("/api/patients")
      .then((res) => res.json())
      .then((data: Patient[]) => Array.isArray(data) && setPatients(data))
      .catch(() => setPatients([]));

    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data: Doctor[]) => Array.isArray(data) && setDoctors(data))
      .catch(() => setDoctors([]));
  }, []);

  // 🔹 Consultas do dia
  const todaysAppointments = appointments.filter((a) => {
    const d = new Date(a.start);
    return d.toDateString() === today.toDateString();
  });

  // 🔹 Consultas do mês atual
  const monthAppointments = appointments
    .filter((a) => {
      const d = new Date(a.start);
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      {/* Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-md border flex items-center gap-4"
        >
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Consultas de hoje</p>
            <h2 className="text-2xl font-bold">{todaysAppointments.length}</h2>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-md border flex items-center gap-4"
        >
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pacientes cadastrados</p>
            <h2 className="text-2xl font-bold">{patients.length}</h2>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-md border flex items-center gap-4"
        >
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Stethoscope size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Doutores</p>
            <h2 className="text-2xl font-bold">{doctors.length}</h2>
          </div>
        </motion.div>
      </div>

      {/* Consultas de hoje */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md border p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Consultas de hoje</h2>

        {todaysAppointments.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta marcada para hoje.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {todaysAppointments.map((a) => (
              <li
                key={a.id}
                className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-lg px-2 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {a.patient?.name ?? "Paciente não identificado"}
                  </p>
                  {a.doctor && (
                    <p className="text-sm text-gray-500">
                      Doutor: {a.doctor.name}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(a.start).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Consultas do mês */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-md border p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Consultas do mês de{" "}
          {today.toLocaleString("pt-BR", { month: "long" })}
        </h2>

        {monthAppointments.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma consulta marcada para este mês.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {monthAppointments.map((a) => (
              <li
                key={a.id}
                className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-lg px-2 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {a.patient?.name ?? "Paciente não identificado"}
                  </p>
                  {a.doctor && (
                    <p className="text-sm text-gray-500">
                      Doutor: {a.doctor.name}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(a.start).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  —{" "}
                  {new Date(a.start).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
