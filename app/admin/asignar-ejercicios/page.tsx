"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function AsignarEjerciciosPage() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [pacienteId, setPacienteId] = useState("")
  const [ejercicioId, setEjercicioId] = useState("")
  const [instrucciones, setInstrucciones] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: p } = await supabase.from("pacientes").select("id, nombre").eq("activo", true).order("nombre")
      const { data: e } = await supabase.from("ejercicios").select("id, titulo").order("titulo")
      if (p) setPacientes(p)
      if (e) setEjercicios(e)
    }
    cargar()
  }, [])

  async function asignar(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    const { error } = await supabase.from("paciente_ejercicios").insert([
      {
        paciente_id: pacienteId,
        ejercicio_id: ejercicioId,
        instrucciones: instrucciones || null
      }
    ])

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      setMensaje("Ejercicio asignado correctamente")
      setPacienteId("")
      setEjercicioId("")
      setInstrucciones("")
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Asignar ejercicios</h1>
            <p className="text-emerald-200 text-xs">Al paciente</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <form onSubmit={asignar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select
                required
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">Selecciona paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ejercicio</label>
              <select
                required
                value={ejercicioId}
                onChange={(e) => setEjercicioId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="">Selecciona ejercicio</option>
                {ejercicios.map((e) => (
                  <option key={e.id} value={e.id}>{e.titulo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones extra (opcional)</label>
              <textarea
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                rows={2}
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                placeholder="Ej: Hacer 3 series de 10 repeticiones"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {cargando ? "Asignando..." : "Asignar ejercicio"}
            </button>
          </form>

          {mensaje && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}