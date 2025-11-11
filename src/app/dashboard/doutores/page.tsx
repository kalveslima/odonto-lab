"use client";

import { useEffect, useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

export default function DoutoresPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Buscar doutores
  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  // Criar doutor
  const handleAdd = async () => {
    if (!name || !specialty) return;
    const res = await fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, specialty }),
    });
    const saved = await res.json();
    setDoctors([...doctors, saved]);
    setName("");
    setSpecialty("");
  };

  // Excluir doutor
  const handleDelete = async (id: number) => {
    await fetch("/api/doctors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDoctors(doctors.filter((d) => d.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Doutores</h2>

      <div className="bg-white rounded-2xl p-6 shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Cadastrar doutor</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Especialidade"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Lista de doutores</h3>
        <ul>
          {doctors.map((d) => (
            <li
              key={d.id}
              className="flex justify-between border-b py-2 items-center"
            >
              <div>
                <span className="font-medium">{d.name}</span>{" "}
                <span className="text-gray-500 text-sm">
                  ({d.specialty})
                </span>
              </div>
              <button
                onClick={() => handleDelete(d.id)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
