"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function ReservarPage() {
  const [horarios, setHorarios] = useState<any[]>([])
  const [horarioId, setHorarioId] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [motivo, setMotivo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("horarios_disponibles")
        .select("*")
        .eq("disponible", true)
        .gte("fecha", new Date().toISOString().split("T")[0])
        .order("fecha")
        .order("hora_inicio")

      if (data) setHorarios(data)
    }
    cargar()
  }, [])

  async function solicitarCita(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    const horario = horarios.find(h => h.id === horarioId)
    if (!horario) return

    // Mensaje para WhatsApp
    const texto = `Hola, quiero agendar una cita:%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${telefono}%0A*Fecha:* ${horario.fecha}%0A*Hora:* ${horario.hora_inicio?.slice(0,5)}%0A*Motivo:* ${motivo}`

    // Abrir WhatsApp
    window.open(`https://wa.me/525620251984?text=${texto}`, "_blank")

    setMensaje("Se abrió WhatsApp. Envía el mensaje para confirmar tu cita.")
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-emerald-700 text-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Fisio-TRQ</h1>
            <p className="text-emerald-200 text-xs">Reservar cita</p>
          </div>
          <a href="/" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">Inicio</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Reservar cita</h2>
          <p className="text-sm text-gray-500 mb-5">Elige un horario disponible y completa tus datos</p>

          {horarios.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay horarios disponibles por el momento.</p>
          ) : (
            <form onSubmit={solicitarCita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario disponible</label>
                <select
                  required
                  value={horarioId}
                  onChange={(e) => setHorarioId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="">Selecciona fecha y hora</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.fecha} · {h.hora_inicio?.slice(0,5)} - {h.hora_fin?.slice(0,5)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                  placeholder="55 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta</label>
                <textarea
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                  placeholder="Describe brevemente..."
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium disabled:opacity-50"
              >
                {cargando ? "Procesando..." : "Solicitar cita por WhatsApp"}
              </button>
            </form>
          )}

          {mensaje && (
            <div className="mt-4 p-3 rounded-lg text-sm bg-emerald-50 text-emerald-700">
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}