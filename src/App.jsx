import { useEffect, useState } from 'react'
import api from './api/client'

function App() {
  const [health, setHealth] = useState({ status: 'pending', payload: null })

  useEffect(() => {
    api
      .get('/health')
      .then((response) => setHealth({ status: 'ok', payload: response.data }))
      .catch((error) => {
        setHealth({
          status: 'error',
          payload: error.response?.data ?? { message: error.message },
        })
      })
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Proyecto base
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-900">
        Aplicacion web agricola
      </h1>
      <p className="mt-4 text-lg leading-7 text-slate-600">
        Este repositorio solo entrega el andamiaje: Laravel, React y la conexion
        a SQL Server. El login, el layout, el dashboard y los CRUD forman parte
        de la prueba.
      </p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Verificacion del backend
        </h2>
        <p className="mt-2 text-slate-700">
          Estado: <strong>{health.status}</strong>
        </p>
        <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
          {JSON.stringify(health.payload, null, 2)}
        </pre>
      </section>
    </main>
  )
}

export default App
