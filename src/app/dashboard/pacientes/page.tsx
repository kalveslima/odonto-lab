export default function PacientesPage() {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Pacientes</h2>
        <p className="mt-2 text-gray-600">
          Lista de pacientes cadastrados na clínica.
        </p>
  
        <div className="mt-6 p-4 bg-white shadow rounded-2xl">
          <ul className="list-disc pl-6">
            <li>João Silva — Consulta: 22/10 às 14h</li>
            <li>Maria Costa — Consulta: 23/10 às 10h</li>
            <li>Paulo Andrade — Consulta: 25/10 às 16h</li>
          </ul>
        </div>
      </div>
    );
  }
  