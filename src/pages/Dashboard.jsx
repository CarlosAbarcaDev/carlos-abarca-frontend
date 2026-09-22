import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Bienvenido, {user?.name}
        </h1>
        <p className="mt-1 text-slate-600">
          Gestiona tus lotes, cultivos y labores desde el menu lateral.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Lotes
          </h2>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">-</p>
          <p className="mt-1 text-sm text-slate-500">Registrados en el sistema</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cultivos
          </h2>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">-</p>
          <p className="mt-1 text-sm text-slate-500">Activos actualmente</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Labores
          </h2>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">-</p>
          <p className="mt-1 text-sm text-slate-500">Realizadas hasta la fecha</p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard