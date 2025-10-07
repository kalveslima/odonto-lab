import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-full max-w-md p-8 bg-blue rounded-2xl shadow">
        <h3 className="text-xl font-semibold">Entrar — OdontoLab</h3>

        <label className="block mt-4">
          <span className="text-sm">E-mail</span>
          <input
            className="mt-1 block w-full rounded border px-3 py-2 bg-black"
            type="email"
            placeholder="seuemail@exemplo.com"
          />
        </label>

        <label className="block mt-4">
          <span className="text-sm">Senha</span>
          <input
            className="mt-1 block w-full rounded border px-3 py-2 bg-blue-50"
            type="password"
            placeholder="********"
          />
        </label>

        <div className="mt-6 flex justify-between items-center">
          <button className="px-4 py-2 rounded bg-blue-600 text-blue-50">
            Entrar
          </button>
          <Link href="/">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
