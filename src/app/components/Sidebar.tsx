import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen border-r p-4 flex flex-col">
      <div className="text-xl font-bold mb-8">🦷 OdontoLab</div>

      <nav className="flex flex-col gap-2 text-gray-700">
        <Link href="/dashboard" className="hover:text-blue-600">
          🏠 Início
        </Link>
        <Link href="/dashboard/agenda" className="hover:text-blue-600">
          📅 Agenda
        </Link>
        <Link href="/dashboard/pacientes" className="hover:text-blue-600">
          👥 Pacientes
        </Link>
        <Link href="/dashboard/doutores" className="hover:text-blue-600">
          🧑‍⚕️ Doutores
        </Link>
        <Link href="/" className="mt-auto text-sm text-gray-500 hover:text-red-500">
          ← Sair
        </Link>
      </nav>
    </aside>
  );
}
