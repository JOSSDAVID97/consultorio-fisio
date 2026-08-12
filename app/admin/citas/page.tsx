"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function CitasPage() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [citas, setCitas] = useState<any[]>([])
  const [pacienteId, setPacienteId] = useState("")
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [notas, setNotas] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const supabase = createClient()

  async function cargarDatos() {
    // Cargar pacientes
    const { data: dataPacientes } = await supabase
      .from("pacientes")
      .select("id, nombre")
      .eq("activo", true)
      .order("nombre")

    if (dataPacientes) setPacientes(dataPacientes)

    // Cargar citas
    const { data: dataCitas } = await supabase
      .from("citas")
      .select(`
        id,
        fecha,
        hora,
        notas,
        estado,
        pacientes ( nombre, telefono )
      `)
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true })

    if (dataCitas) setCitas(dataCitas)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  async function crearCita(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    const { error } = await supabase.from("citas").insert([
      {
        paciente_id: pacienteId,
        fecha,
        hora,
        notas,
        estado: "programada"
      }
    ])

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      setMensaje("Cita agendada correctamente")
      setPacienteId("")
      setFecha("")
      setHora("")
      setNotas("")
      cargarDatos()
    }

    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Citas</h1>
            <p className="text-emerald-200 text-sm">Agenda y gestión</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
            ← Volver
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* Formulario nueva cita */}
        <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Agendar nueva cita</h2>

          <form onSubmit={crearCita} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select
                required
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecciona un paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Dolor de espalda baja"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Agendar cita"}
            </button>
          </form>

          {mensaje && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensaje}
            </div>
          )}
        </div>

        {/* Lista de citas */}
        <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Citas programadas ({citas.length})
          </h2>

          {citas.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay citas agendadas todavía.</p>
          ) : (
            <div className="space-y-3">
              {citas.map((cita) => (
                <div key={cita.id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        {cita.pacientes?.nombre || "Paciente"}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {cita.fecha} · {cita.hora?.slice(0, 5)}
                      </p>
                      {cita.notas && (
                        <p className="text-sm text-gray-600 mt-1">{cita.notas}</p>
                      )}
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                      {cita.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
