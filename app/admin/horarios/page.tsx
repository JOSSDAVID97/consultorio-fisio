"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function HorariosPage() {
  const [fecha, setFecha] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [horarios, setHorarios] = useState<any[]>([])
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const supabase = createClient()

  async function cargarHorarios() {
    const { data } = await supabase
      .from("horarios_disponibles")
      .select("*")
      .order("fecha", { ascending: true })
      .order("hora_inicio", { ascending: true })

    if (data) setHorarios(data)
  }

  useEffect(() => {
    cargarHorarios()
  }, [])

  async function agregarHorario(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    // La cita dura 1 hora automáticamente
    const [h, m] = horaInicio.split(":").map(Number)
    const finH = (h + 1) % 24
    const horaFin = `${String(finH).padStart(2, "0")}:${String(m).padStart(2, "0")}`

    const { error } = await supabase.from("horarios_disponibles").insert([
      {
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        disponible: true
      }
    ])

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      setMensaje(`Horario agregado: ${horaInicio} - ${horaFin}`)
      setHoraInicio("")
      cargarHorarios()
    }
    setCargando(false)
  }

  async function eliminarHorario(id: string) {
    if (!confirm("¿Eliminar este horario?")) return
    await supabase.from("horarios_disponibles").delete().eq("id", id)
    cargarHorarios()
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Horarios disponibles</h1>
            <p className="text-emerald-200 text-xs">Cada cita dura 1 hora</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-800 mb-4">Agregar horario libre</h2>

          <form onSubmit={agregarHorario} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de inicio (tú eliges)
              </label>
              <input
                type="time"
                required
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: si pones 17:00, la cita será de 17:00 a 18:00
              </p>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Agregar horario de 1 hora"}
            </button>
          </form>

          {mensaje && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensaje}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-800 mb-4">
            Horarios configurados ({horarios.length})
          </h2>

          {horarios.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no has agregado horarios.</p>
          ) : (
            <div className="space-y-3">
              {horarios.map((h) => (
                <div key={h.id} className="flex justify-between items-center border rounded-xl p-4">
                  <div>
                    <p className="font-medium text-gray-800">{h.fecha}</p>
                    <p className="text-sm text-emerald-700">
                      {h.hora_inicio?.slice(0, 5)} - {h.hora_fin?.slice(0, 5)}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarHorario(h.id)}
                    className="text-sm text-red-600 px-3 py-1.5 rounded-lg border border-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}