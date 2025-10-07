import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <header className="w-full max-w-5xl flex items-center justify-between py-6">
        <h1 className="text-2xl font-semibold">OdontoLab</h1>
        <nav className="space-x-4">
          <Link href="/login" className="px-4 py-2 border rounded">
            Login
          </Link>
        </nav>
      </header>

      <section className="text-center py-16">
        <h2 className="text-4xl font-bold">
          Simplifique o agendamento odontológico da sua clínica
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl text-center mx-auto">
          Unifique pacientes, recepção e doutores em um único sistema.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-blue-500 text-white"
          >
            Começar agora
          </Link>
        </div>
      </section>
    </main>
  );
}
