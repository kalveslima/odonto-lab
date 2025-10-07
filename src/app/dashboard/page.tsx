export default function DashboardPage() {
    return (
      <main className="min-h-screen p-8">
        <h2 className="text-2xl font-semibold">Painel — OdontoLab</h2>
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl shadow">Agenda rápida</div>
          <div className="p-4 rounded-2xl shadow">Próximas consultas</div>
          <div className="p-4 rounded-2xl shadow">Resumo de pacientes</div>
        </section>
      </main>
    );
  }
// Compare this snippet from src/app/dashboard/page.tsx:  