import { useEffect, useState } from 'react'
import api from '../api/client'
import { formatMoney } from '../utils/format'

function Reportes() {
  const [reportes, setReportes] = useState({ por_hacienda: [], por_responsable: [], totales: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    api
      .get('/reportes')
      .then((res) => {
        const data = res.data.data || {}
        setReportes({
          por_hacienda: data.por_hacienda || [],
          por_responsable: data.por_responsable || [],
          totales: data.totales || {},
        })
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudieron cargar los reportes. Intente nuevamente.')
        setLoading(false)
      })
  }, [])

  function exportCsv() {
    setExporting(true)
    api
      .get('/reportes/exportar', { responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.download = 'reporte_labores.csv'
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
      .catch(() => setError('No se pudo exportar el reporte. Intente nuevamente.'))
      .finally(() => setExporting(false))
  }

  const totales = reportes.totales

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reportes</h1>
          <p className="mt-1 text-slate-600">
            Indicadores y resumenes del sistema.
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={exporting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {exporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Haciendas activas</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? '-' : totales.haciendas ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Labores activas</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? '-' : totales.labores ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Costo total</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? '-' : formatMoney(totales.costo_total)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">
            Resumen por hacienda
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hacienda
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lotes
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cultivos
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Labores
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Costo total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : reportes.por_hacienda.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              reportes.por_hacienda.map((hacienda) => (
                <tr key={hacienda.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {hacienda.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{hacienda.lotes}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{hacienda.cultivos}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{hacienda.labores}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600">
                    {formatMoney(hacienda.costo_total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">
            Resumen por responsable
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Responsable
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Labores
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Costo total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-4 py-10 text-center text-sm text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : reportes.por_responsable.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              reportes.por_responsable.map((responsable) => (
                <tr key={responsable.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {responsable.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{responsable.labores}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600">
                    {formatMoney(responsable.costo_total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reportes