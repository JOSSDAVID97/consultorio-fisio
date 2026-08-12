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

  const supabase = createClient()

  async function cargarEjercicios() {
    const { data } = await supabase
      .from("ejercicios")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setEjercicios(data)
  }

  useEffect(() => {
    cargarEjercicios()
  }, [])

  async function crearEjercicio(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    let imagenUrl = null
    let videoArchivoUrl = null

    // Subir archivo si existe
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

      const { data: urlData } = supabase.storage
        .from("ejercicios")
        .getPublicUrl(nombreArchivo)

      // Detectar si es imagen o video
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
      setMensaje("Ejercicio guardado correctamente")
      setTitulo("")
      setDescripcion("")
      setVideoUrl("")
      setArchivo(null)
      cargarEjercicios()
    }

    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Ejercicios</h1>
            <p className="text-emerald-200 text-sm">Subir y gestionar</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
            ← Volver
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Subir nuevo ejercicio</h2>

          <form onSubmit={crearEjercicio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del ejercicio</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Estiramiento de isquiotibiales"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Instrucciones</label>
              <textarea
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Explica cómo se realiza el ejercicio..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subir imagen o video desde tu dispositivo
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes subir fotos o videos cortos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                O pega un link de YouTube / Drive (opcional)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://youtube.com/..."
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar ejercicio"}
            </button>
          </form>

          {mensaje && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensaje}
            </div>
          )}
        </div>

        {/* Lista de ejercicios */}
        <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Ejercicios guardados ({ejercicios.length})
          </h2>

          {ejercicios.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no has subido ejercicios.</p>
          ) : (
            <div className="space-y-4">
              {ejercicios.map((ej) => (
                <div key={ej.id} className="border rounded-xl p-4">
                  <p className="font-medium text-gray-800">{ej.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1">{ej.descripcion}</p>

                  {ej.imagen_url && (
                    <img 
                      src={ej.imagen_url} 
                      alt={ej.titulo}
                      className="mt-3 rounded-lg max-h-48 object-cover"
                    />
                  )}

                  {ej.video_url && (
                    <div className="mt-3">
                      {ej.video_url.includes("youtube") || ej.video_url.includes("youtu.be") ? (
                        <a href={ej.video_url} target="_blank" className="text-sm text-emerald-600 hover:underline">
                          Ver en YouTube →
                        </a>
                      ) : (
                        <video 
                          src={ej.video_url} 
                          controls 
                          className="rounded-lg max-h-48 w-full"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}