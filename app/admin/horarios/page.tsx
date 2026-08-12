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
  const [mostrarForm, setMostrarForm] = useState(false)

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

  function generarSlots(inicio: string, fin: string) {
    const slots: string[] = []
    let [h, m] = inicio.split(":").map(Number)
    const [hFin, mFin] = fin.split(":").map(Number)

    while (h < hFin || (h === hFin && m < mFin)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
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
    const registros = slots.map((hora) => {
      const [h, m] = hora.split(":").map(Number)
      return {
        fecha,
        hora_inicio: hora,
        hora_fin: `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        disponible: true
      }
    })

    const { error } = await supabase.from("horarios_disponibles").insert(registros)

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      setMensaje(`Se crearon ${slots.length} horarios`)
      setFecha("")
      setMostrarForm(false)
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
      <header className="bg-emerald-700 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Horarios</h1>
            <p className="text-emerald-200 text-xs">{horarios.length} disponibles</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-medium"
          >
            + Agregar disponibilidad
          </button>
        )}

        {mostrarForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-800 mb-1">Nueva disponibilidad</h2>
            <p className="text-xs text-gray-500 mb-4">Se crean citas de 1 hora cada 30 min</p>

            <form onSubmit={agregarHorarios} className="space-y-3">
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Desde</label>
                  <input
                    type="time"
                    required
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full border rounded-xl px-3 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Hasta</label>
                  <input
                    type="time"
                    required
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="w-full border rounded-xl px-3 py-3 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarForm(false)}
                  className="flex-1 border py-3 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {cargando ? "Creando..." : "Generar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {mensaje}
          </div>
        )}

        <div className="space-y-2">
          {horarios.map((h) => (
            <div key={h.id} className="bg-white rounded-xl p-4 flex justify-between items-center border">
              <div>
                <p className="font-medium text-sm text-gray-800">{h.fecha}</p>
                <p className="text-sm text-emerald-600">
                  {h.hora_inicio?.slice(0, 5)} - {h.hora_fin?.slice(0, 5)}
                </p>
              </div>
              <button
                onClick={() => eliminarHorario(h.id)}
                className="text-xs text-red-600 px-3 py-1.5 rounded-lg border border-red-200"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}