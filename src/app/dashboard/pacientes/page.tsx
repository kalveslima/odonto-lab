"use client";

import { useEffect, useState } from "react";

interface Patient {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar pacientes na API
  const fetchPatients = async () => {
    const res = await fetch("/api/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // 🔹 Cadastrar novo paciente
  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    if (res.ok) {
      setName("");
      setPhone("");
      fetchPatients(); // recarrega lista
    }
    setLoading(false);
  };

  // 🔹 Deletar paciente
  const handleDelete = async (id: number) => {
    await fetch("/api/patients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPatients();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pacientes</h1>

      {/* Formulário de cadastro */}
      <form
        onSubmit={handleAddPatient}
        className="flex gap-4 mb-8 bg-gray-100 p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="Nome do paciente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-1/3"
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-1/3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </form>

      {/* Lista de pacientes */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Telefone</th>
            <th className="p-3 text-left">Data de Cadastro</th>
            <th className="p-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Nenhum paciente cadastrado.
              </td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">
                  {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
