import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { formatMoney } from '../utils/format'

const STATS = [
  { key: 'haciendas', label: 'Haciendas', description: 'Registradas en el sistema', money: false },
  { key: 'lotes', label: 'Lotes', description: 'Registrados en el sistema', money: false },
  { key: 'cultivos', label: 'Cultivos', description: 'Registrados en el sistema', money: false },
  { key: 'labores', label: 'Labores', description: 'Realizadas hasta la fecha', money: false },
  { key: 'responsables', label: 'Responsables', description: 'Activos actualmente', money: false },
  { key: 'costo_total_labores', label: 'Costo total de labores', description: 'Acumulado en el sistema', money: true },
]

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => {
        setStats(res.data.data || {})
        setLoading(false)
      })
      .catch((err) => {
        setError('No se pudieron cargar los indicadores. Intente nuevamente.')
        setLoading(false)
      })
  }, [])

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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {stat.label}
            </h2>
            <p className="mt-2 text-3xl font-semibold text-emerald-700">
              {loading ? '-' : stat.money ? formatMoney(stats[stat.key]) : stats[stat.key]}
            </p>
            <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Dashboard