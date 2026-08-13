"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function EjerciciosPage() {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [categoria, setCategoria] = useState("General")
  const [videoUrl, setVideoUrl] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

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
        setMensaje("Error al subir: " + errorUpload.message)
        setCargando(false)
        return
      }

      const { data: urlData } = supabase.storage.from("ejercicios").getPublicUrl(nombreArchivo)
      if (archivo.type.startsWith("image/")) imagenUrl = urlData.publicUrl
      else if (archivo.type.startsWith("video/")) videoArchivoUrl = urlData.publicUrl
    }

    const { error } = await supabase.from("ejercicios").insert([
      {
        titulo,
        descripcion,
        categoria,
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
      setCategoria("General")
      setVideoUrl("")
      setArchivo(null)
      setMostrarForm(false)
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
      setMensaje("Ejercicio asignado correctamente")
      setEjercicioSeleccionado(null)
      setPacienteId("")
      setInstrucciones("")
    }
    setAsignando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Ejercicios</h1>
            <p className="text-emerald-200 text-xs">{ejercicios.length} guardados</p>
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
            + Subir ejercicio
          </button>
        )}

        {mostrarForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-800 mb-4">Nuevo ejercicio</h2>
            <form onSubmit={crearEjercicio} className="space-y-3">
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título del ejercicio"
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm"
              >
                <option value="General">General</option>
                <option value="Brazo">Brazo</option>
                <option value="Hombro">Hombro</option>
                <option value="Espalda">Espalda</option>
                <option value="Cuello">Cuello</option>
                <option value="Pierna">Pierna</option>
                <option value="Rodilla">Rodilla</option>
                <option value="Tobillo">Tobillo</option>
                <option value="Core">Core / Abdomen</option>
              </select>

              <textarea
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Instrucciones..."
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />

              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm"
              />

              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="O link de YouTube (opcional)"
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />

              <div className="flex gap-2">
                <button type="button" onClick={() => setMostrarForm(false)} className="flex-1 border py-3 rounded-xl text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={cargando} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                  {cargando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {mensaje && !ejercicioSeleccionado && (
          <div className={`p-4 rounded-xl text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {mensaje}
          </div>
        )}

        <div className="space-y-3">
          {ejercicios.map((ej) => (
            <div key={ej.id} className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-800">{ej.titulo}</p>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  {ej.categoria || "General"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ej.descripcion}</p>
              {ej.imagen_url && (
                <img src={ej.imagen_url} alt={ej.titulo} className="mt-3 rounded-xl max-h-40 object-cover w-full" />
              )}
              <button
                onClick={() => {
                  setEjercicioSeleccionado(ej)
                  setMensaje("")
                }}
                className="mt-3 w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Asignar a paciente
              </button>
            </div>
          ))}
        </div>
      </div>

      {ejercicioSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <h3 className="font-bold text-lg mb-1">Asignar ejercicio</h3>
            <p className="text-sm text-gray-600 mb-4">{ejercicioSeleccionado.titulo}</p>
            <form onSubmit={asignarEjercicio} className="space-y-3">
              <select required value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm">
                <option value="">Selecciona paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <textarea value={instrucciones} onChange={(e) => setInstrucciones(e.target.value)} rows={2} placeholder="Instrucciones extra (opcional)" className="w-full border rounded-xl px-4 py-3 text-sm" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setEjercicioSeleccionado(null)} className="flex-1 border py-3 rounded-xl text-sm">Cancelar</button>
                <button type="submit" disabled={asignando} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
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