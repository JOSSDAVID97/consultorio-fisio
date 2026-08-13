"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function CitasPage() {
  const [citas, setCitas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  const supabase = createClient()

  async function cargarCitas() {
    const { data } = await supabase
      .from("citas")
      .select("*")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true })

    if (data) setCitas(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  async function cambiarEstado(id: string, nuevoEstado: string) {
    await supabase.from("citas").update({ estado: nuevoEstado }).eq("id", id)
    cargarCitas()
  }

  function agregarAlCalendario(cita: any) {
    const titulo = "Cita Fisio-TRQ"
    const descripcion = cita.notas || "Cita de fisioterapia"
    const fecha = cita.fecha // formato YYYY-MM-DD
    const hora = cita.hora?.slice(0, 5) || "12:00" // HH:MM

    // Crear fecha de inicio y fin (1 hora)
    const inicio = new Date(`${fecha}T${hora}:00`)
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000)

    // Formato para Google Calendar / iOS
    const formatDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${formatDate(inicio)}/${formatDate(fin)}&details=${encodeURIComponent(descripcion)}`

    window.open(url, "_blank")
  }

  const programadas = citas.filter(c => c.estado === "programada")
  const otras = citas.filter(c => c.estado !== "programada")

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Citas</h1>
            <p className="text-emerald-200 text-xs">{programadas.length} pendientes</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {cargando ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : programadas.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
            No hay citas programadas
          </div>
        ) : (
          programadas.map((cita) => (
            <div key={cita.id} className="bg-white rounded-2xl p-5 shadow-sm border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{cita.fecha}</p>
                  <p className="text-emerald-600 font-medium">{cita.hora?.slice(0, 5)} hrs</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                  Programada
                </span>
              </div>

              {cita.notas && (
                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                  {cita.notas}
                </p>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => agregarAlCalendario(cita)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium"
                >
                  📅 Agregar al calendario
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => cambiarEstado(cita.id, "completada")}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium"
                  >
                    Completada
                  </button>
                  <button
                    onClick={() => cambiarEstado(cita.id, "cancelada")}
                    className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-medium border border-red-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {otras.length > 0 && (
          <div className="pt-4">
            <p className="text-sm text-gray-500 mb-3">Historial</p>
            {otras.map((cita) => (
              <div key={cita.id} className="bg-white rounded-xl p-4 mb-2 border opacity-70">
                <p className="font-medium text-gray-700">{cita.fecha} · {cita.hora?.slice(0,5)}</p>
                <p className="text-xs text-gray-500 mt-1">{cita.estado}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}