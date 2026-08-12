"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function PacientePortal() {
  const params = useParams()
  const token = params.token as string

  const [paciente, setPaciente] = useState<any>(null)
  const [citas, setCitas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  const supabase = createClient()

  useEffect(() => {
    async function cargarDatos() {
      // Buscar paciente por token
      const { data: dataPaciente, error: errorPaciente } = await supabase
        .from("pacientes")
        .select("*")
        .eq("token_acceso", token)
        .eq("activo", true)
        .single()

      if (errorPaciente || !dataPaciente) {
        setError("Link no válido o paciente no encontrado")
        setCargando(false)
        return
      }

      setPaciente(dataPaciente)

      // Cargar citas del paciente
      const { data: dataCitas } = await supabase
        .from("citas")
        .select("*")
        .eq("paciente_id", dataPaciente.id)
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true })

      if (dataCitas) setCitas(dataCitas)

      setCargando(false)
    }

    if (token) {
      cargarDatos()
    }
  }, [token])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Cargando tu información...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Acceso no válido</h1>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const citasProximas = citas.filter(c => c.estado === "programada")
  const nombreCorto = paciente.nombre.split(" ")[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-10">
      {/* Header */}
      <header className="bg-emerald-700 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-lg font-bold">Fisio-TRQ</h1>
          <p className="text-emerald-200 text-xs">Portal del paciente</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">

        {/* Saludo */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-xl font-bold text-gray-800">
            Hola, {nombreCorto} 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Aquí puedes ver tus citas y ejercicios
          </p>
        </div>

        {/* Citas */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📅</span> Mis citas
          </h3>

          {citasProximas.length === 0 ? (
            <p className="text-gray-500 text-sm">No tienes citas programadas.</p>
          ) : (
            <div className="space-y-3">
              {citasProximas.map((cita) => (
                <div key={cita.id} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="font-medium text-gray-800">
                    {cita.fecha}
                  </p>
                  <p className="text-sm text-emerald-700 mt-0.5">
                    {cita.hora?.slice(0, 5)} hrs
                  </p>
                  {cita.notas && (
                    <p className="text-sm text-gray-600 mt-2">{cita.notas}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ejercicios */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>💪</span> Mis ejercicios
          </h3>
          <p className="text-gray-500 text-sm">
            Aún no tienes ejercicios asignados. Tu fisioterapeuta los subirá pronto.
          </p>
        </div>

        {/* Botón WhatsApp */}
        <a
          href={`https://wa.me/525620251984?text=${encodeURIComponent(
            `Hola, soy ${paciente.nombre}. Tengo una duda sobre mi tratamiento.`
          )}`}
          target="_blank"
          className="block w-full bg-green-600 text-white text-center py-4 rounded-2xl font-medium hover:bg-green-700 transition shadow-lg shadow-green-200"
        >
          ¿Tienes dudas? Escríbenos por WhatsApp
        </a>

        {/* Info de contacto */}
        <div className="text-center text-xs text-gray-400 pt-2">
          <p>Fisio-TRQ · Tadeo García Estrada</p>
          <p>Cédula 36349</p>
        </div>
      </div>
    </main>
  )
}