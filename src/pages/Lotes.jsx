import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'

const CIUDAD = 'Cordoba, Argentina'

function Lotes() {
  const [lotes, setLotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [errorForm, setErrorForm] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [onlyActive, setOnlyActive] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deletingLote, setDeletingLote] = useState(null)
  const [form, setForm] = useState({ hacienda_id: '', nombre: '', hectareas: '' })

  const haciendas = useMemo(() => {
    const unique = new Map()
    lotes.forEach((lote) => {
      if (lote.hacienda) unique.set(lote.hacienda.id, lote.hacienda)
    })
    return Array.from(unique.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    )
  }, [lotes])

  useEffect(() => {
    loadLotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyActive])

  function loadLotes() {
    setLoading(true)
    setError('')
    api
      .get('/lotes', { params: onlyActive ? { activos: 1 } : {} })
      .then((res) => {
        setLotes(res.data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudieron cargar los lotes. Intente nuevamente.')
        setLoading(false)
      })
  }

  function openCreate() {
    setEditing(null)
    setForm({
      hacienda_id: haciendas.length ? String(haciendas[0].id) : '',
      nombre: '',
      hectareas: '',
    })
    setErrorForm('')
    setModalOpen(true)
  }

  function openEdit(lote) {
    setEditing(lote)
    setForm({
      hacienda_id: String(lote.hacienda_id),
      nombre: lote.nombre,
      hectareas: String(lote.hectareas),
    })
    setErrorForm('')
    setModalOpen(true)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrorForm('')

    const payload = {
      hacienda_id: form.hacienda_id,
      nombre: form.nombre,
      hectareas: form.hectareas,
    }

    const request = editing
      ? api.put(`/lotes/${editing.id}`, payload)
      : api.post('/lotes', payload)

    request
      .then(() => {
        setModalOpen(false)
        loadLotes()
      })
      .catch((err) => {
        const errors = err.response?.data?.errors
        setErrorForm(
          errors
            ? Object.values(errors).flat().join(' ')
            : 'No se pudo guardar el lote. Intente nuevamente.'
        )
      })
      .finally(() => setSaving(false))
  }

  function toggleStatus(lote) {
    api
      .put(`/lotes/${lote.id}`, {
        hacienda_id: lote.hacienda_id,
        nombre: lote.nombre,
        hectareas: lote.hectareas,
        estatus: lote.estatus ? 0 : 1,
      })
      .then(() => loadLotes())
      .catch(() => setError('No se pudo actualizar el estado del lote.'))
  }

  function confirmDelete() {
    if (!deletingLote) return
    setDeleting(true)
    api
      .delete(`/lotes/${deletingLote.id}`)
      .then(() => {
        setDeletingLote(null)
        loadLotes()
      })
      .catch(() => {
        setDeletingLote(null)
        setError('No se pudo eliminar el lote. Intente nuevamente.')
      })
      .finally(() => setDeleting(false))
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Lotes</h1>
          <p className="mt-1 text-slate-600">
            Gestion de parcelas de terreno de las haciendas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Solo activos
          </label>
          <button
            onClick={openCreate}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Nuevo lote
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hacienda
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hectareas
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acciones
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
            ) : lotes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay lotes registrados.
                </td>
              </tr>
            ) : (
              lotes.map((lote) => (
                <tr key={lote.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {lote.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {lote.hacienda?.nombre ?? `Hacienda ${lote.hacienda_id}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {lote.hectareas}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(lote)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        lote.estatus
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      title="Cambiar estado"
                    >
                      {lote.estatus ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(lote)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeletingLote(lote)}
                        className="rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              {editing ? 'Editar lote' : 'Nuevo lote'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Ciudad de referencia: {CIUDAD}</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {errorForm && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorForm}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Hacienda
                </label>
                <select
                  name="hacienda_id"
                  value={form.hacienda_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Seleccione una hacienda</option>
                  {haciendas.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="Ej: Lote Norte"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Hectareas
                </label>
                <input
                  name="hectareas"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.hectareas}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 45.5"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear lote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Eliminar lote</h2>
            <p className="mt-2 text-sm text-slate-600">
              Esta accion eliminara permanentemente el lote{' '}
              <span className="font-semibold text-slate-900">
                {deletingLote.nombre}
              </span>
              . Esta operacion no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeletingLote(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Lotes