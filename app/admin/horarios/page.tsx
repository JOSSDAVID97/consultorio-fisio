"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function HorariosPage() {
  const [fecha, setFecha] = useState("")
  const [horaInicio, setHoraInicio] = useState("12:00")
  const [horaFin, setHoraFin] = useState("18:00")
  const [horarios, setHorarios] = useState<any[]>([])
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const supabase = createClient()

  async function cargarHorarios() {
    const { data } = await supabase
      .from("horarios_disponibles")
      .select("*")
      .order("fecha")
      .order("hora_inicio")

    if (data) setHorarios(data)
  }

  useEffect(() => {
    cargarHorarios()
  }, [])

  // Genera slots de 1 hora cada 30 minutos dentro del rango
  function generarSlots(inicio: string, fin: string) {
    const slots: string[] = []
    let [h, m] = inicio.split(":").map(Number)
    const [hFin, mFin] = fin.split(":").map(Number)

    while (h < hFin || (h === hFin && m < mFin)) {
      const horaStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      slots.push(horaStr)

      // Avanzar 30 minutos
      m += 30
      if (m >= 60) {
        m = 0
        h += 1
      }
    }
    return slots
  }

  async function agregarHorarios(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    const slots = generarSlots(horaInicio, horaFin)

    // Guardamos cada slot posible (duración 1 hora)
    const registros = slots.map((hora) => {
      const [h, m] = hora.split(":").map(Number)
      const finH = h + 1
      const horaFinSlot = `${String(finH).padStart(2, "0")}:${String(m).padStart(2, "0")}`

      return {
        fecha,
        hora_inicio: hora,
        hora_fin: horaFinSlot,
        disponible: true
      }
    })

    const { error } = await supabase.from("horarios_disponibles").insert(registros)

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      setMensaje(`Se crearon ${slots.length} horarios disponibles`)
      setFecha("")
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
            <p className="text-emerald-200 text-xs">Define tu rango del día</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-800 mb-1">Agregar disponibilidad</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ejemplo: de 12:00 a 18:00 → se crean citas posibles cada 30 min (cada una dura 1 hora)
          </p>

          <form onSubmit={agregarHorarios} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="time"
                  required
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="time"
                  required
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {cargando ? "Creando horarios..." : "Generar horarios del día"}
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
            Horarios generados ({horarios.length})
          </h2>

          {horarios.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no hay horarios.</p>
          ) : (
            <div className="space-y-2">
              {horarios.map((h) => (
                <div key={h.id} className="flex justify-between items-center border rounded-lg p-3">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{h.fecha}</p>
                    <p className="text-sm text-emerald-700">
                      {h.hora_inicio?.slice(0, 5)} - {h.hora_fin?.slice(0, 5)}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarHorario(h.id)}
                    className="text-xs text-red-600 px-2 py-1 rounded border border-red-200"
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