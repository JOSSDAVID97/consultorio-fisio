"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function EjerciciosPage() {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])

  // Para asignar
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<any>(null)
  const [pacienteId, setPacienteId] = useState("")
  const [instrucciones, setInstrucciones] = useState("")
  const [asignando, setAsignando] = useState(false)

  const supabase = createClient()

  async function cargarDatos() {
    const { data: ej } = await supabase.from("ejercicios").select("*").order("created_at", { ascending: false })
    const { data: p } = await supabase.from("pacientes").select("id, nombre").eq("activo", true).order("nombre")
    if (ej) setEjercicios(ej)
    if (p) setPacientes(p)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  async function crearEjercicio(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    let imagenUrl = null
    let videoArchivoUrl = null

    if (archivo) {
      const extension = archivo.name.split(".").pop()
      const nombreArchivo = `${Date.now()}.${extension}`

      const { error: errorUpload } = await supabase.storage
        .from("ejercicios")
        .upload(nombreArchivo, archivo)

      if (errorUpload) {
        setMensaje("Error al subir el archivo: " + errorUpload.message)
        setCargando(false)
        return
      }

      const { data: urlData } = supabase.storage.from("ejercicios").getPublicUrl(nombreArchivo)

      if (archivo.type.startsWith("image/")) {
        imagenUrl = urlData.publicUrl
      } else if (archivo.type.startsWith("video/")) {
        videoArchivoUrl = urlData.publicUrl
      }
    }

    const { error } = await supabase.from("ejercicios").insert([
      {
        titulo,
        descripcion,
        video_url: videoUrl || videoArchivoUrl || null,
        imagen_url: imagenUrl
      }
    ])

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      setMensaje("Ejercicio guardado")
      setTitulo("")
      setDescripcion("")
      setVideoUrl("")
      setArchivo(null)
      cargarDatos()
    }
    setCargando(false)
  }

  async function asignarEjercicio(e: React.FormEvent) {
    e.preventDefault()
    if (!ejercicioSeleccionado) return
    setAsignando(true)

    const { error } = await supabase.from("paciente_ejercicios").insert([
      {
        paciente_id: pacienteId,
        ejercicio_id: ejercicioSeleccionado.id,
        instrucciones: instrucciones || null
      }
    ])

    if (error) {
      setMensaje("Error al asignar: " + error.message)
    } else {
      setMensaje(`Ejercicio asignado a paciente correctamente`)
      setEjercicioSeleccionado(null)
      setPacienteId("")
      setInstrucciones("")
    }
    setAsignando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Ejercicios</h1>
            <p className="text-emerald-200 text-xs">Subir y asignar</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Formulario subir */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-800 mb-4">Subir nuevo ejercicio</h2>
          <form onSubmit={crearEjercicio} className="space-y-3">
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del ejercicio"
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Instrucciones..."
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="O link de YouTube (opcional)"
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar ejercicio"}
            </button>
          </form>
          {mensaje && !ejercicioSeleccionado && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensaje}
            </div>
          )}
        </div>

        {/* Lista de ejercicios */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-800 mb-4">Ejercicios ({ejercicios.length})</h2>

          {ejercicios.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no hay ejercicios.</p>
          ) : (
            <div className="space-y-3">
              {ejercicios.map((ej) => (
                <div key={ej.id} className="border rounded-xl p-4">
                  <p className="font-medium text-gray-800">{ej.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ej.descripcion}</p>
                  <button
                    onClick={() => {
                      setEjercicioSeleccionado(ej)
                      setMensaje("")
                    }}
                    className="mt-3 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg"
                  >
                    Asignar a paciente
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal simple de asignación */}
      {ejercicioSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <h3 className="font-bold text-lg mb-1">Asignar ejercicio</h3>
            <p className="text-sm text-gray-600 mb-4">{ejercicioSeleccionado.titulo}</p>

            <form onSubmit={asignarEjercicio} className="space-y-3">
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

              <textarea
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                rows={2}
                placeholder="Instrucciones extra (opcional)"
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEjercicioSeleccionado(null)}
                  className="flex-1 border py-2.5 rounded-lg text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={asignando}
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {asignando ? "Asignando..." : "Asignar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}