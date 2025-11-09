export default function DoutoresPage() {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Doutores</h2>
        <p className="mt-2 text-gray-600">
          Profissionais disponíveis na clínica.
        </p>
  
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold">Dra. Ana Oliveira</h3>
            <p>Especialista em Ortodontia</p>
          </div>
  
          <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold">Dr. Carlos Santos</h3>
            <p>Implantodontia</p>
          </div>
  
          <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold">Dra. Beatriz Lima</h3>
            <p>Clínico Geral</p>
          </div>
        </div>
      </div>
    );
  }
  