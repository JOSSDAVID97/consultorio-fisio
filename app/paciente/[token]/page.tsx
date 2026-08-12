"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function PacientePortal() {
  const params = useParams()
  const token = params.token as string

  const [paciente, setPaciente] = useState<any>(null)
  const [citas, setCitas] = useState<any[]>([])
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  const supabase = createClient()

  useEffect(() => {
    async function cargarDatos() {
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

      // Citas
      const { data: dataCitas } = await supabase
        .from("citas")
        .select("*")
        .eq("paciente_id", dataPaciente.id)
        .eq("estado", "programada")
        .order("fecha", { ascending: true })

      if (dataCitas) setCitas(dataCitas)

      // Ejercicios asignados
      const { data: dataEjercicios } = await supabase
        .from("paciente_ejercicios")
        .select(`
          id,
          instrucciones,
          ejercicios (
            id,
            titulo,
            descripcion,
            video_url,
            imagen_url
          )
        `)
        .eq("paciente_id", dataPaciente.id)

      if (dataEjercicios) setEjercicios(dataEjercicios)

      setCargando(false)
    }

    if (token) cargarDatos()
  }, [token])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Cargando...</p>
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

  const nombreCorto = paciente.nombre.split(" ")[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-10">
      <header className="bg-emerald-700 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/logo.png" alt="Fisio-TRQ" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
          <div>
            <h1 className="text-lg font-bold">Fisio-TRQ</h1>
            <p className="text-emerald-200 text-xs">Portal del paciente</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Saludo */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-xl font-bold text-gray-800">Hola, {nombreCorto} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Aquí puedes ver tus citas y ejercicios</p>
        </div>

        {/* Citas */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-3">📅 Mis citas</h3>
          {citas.length === 0 ? (
            <p className="text-gray-500 text-sm">No tienes citas programadas.</p>
          ) : (
            <div className="space-y-3">
              {citas.map((cita) => (
                <div key={cita.id} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="font-medium text-gray-800">{cita.fecha}</p>
                  <p className="text-sm text-emerald-700 mt-0.5">{cita.hora?.slice(0, 5)} hrs</p>
                  {cita.notas && <p className="text-sm text-gray-600 mt-2">{cita.notas}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ejercicios */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-3">💪 Mis ejercicios</h3>
          {ejercicios.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no tienes ejercicios asignados.</p>
          ) : (
            <div className="space-y-4">
              {ejercicios.map((item) => {
                const ej = item.ejercicios
                return (
                  <div key={item.id} className="border rounded-xl p-4">
                    <p className="font-medium text-gray-800">{ej?.titulo}</p>
                    <p className="text-sm text-gray-600 mt-1">{ej?.descripcion}</p>
                    {item.instrucciones && (
                      <p className="text-sm text-emerald-700 mt-2 font-medium">
                        Instrucciones: {item.instrucciones}
                      </p>
                    )}
                    {ej?.imagen_url && (
                      <img src={ej.imagen_url} alt={ej.titulo} className="mt-3 rounded-lg max-h-48 object-cover w-full" />
                    )}
                    {ej?.video_url && (
                      <div className="mt-3">
                        {ej.video_url.includes("youtube") || ej.video_url.includes("youtu.be") ? (
                          <a href={ej.video_url} target="_blank" className="text-sm text-emerald-600 hover:underline">
                            Ver video →
                          </a>
                        ) : (
                          <video src={ej.video_url} controls className="rounded-lg max-h-48 w-full" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/525620251984?text=${encodeURIComponent(
            `Hola, soy ${paciente.nombre}. Tengo una duda sobre mi tratamiento.`
          )}`}
          target="_blank"
          className="block w-full bg-green-600 text-white text-center py-4 rounded-2xl font-medium shadow-lg shadow-green-200"
        >
          ¿Tienes dudas? Escríbenos por WhatsApp
        </a>
      </div>
    </main>
  )
}