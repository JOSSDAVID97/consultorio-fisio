"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function PacientesPage() {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [linkGenerado, setLinkGenerado] = useState("")
  const [cargando, setCargando] = useState(false)
  const [pacientes, setPacientes] = useState<any[]>([])

  const supabase = createClient()

  // Cargar lista de pacientes
  async function cargarPacientes() {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPacientes(data)
    }
  }

  useEffect(() => {
    cargarPacientes()
  }, [])

  async function darDeAlta(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setMensaje("")
    setLinkGenerado("")

    const token = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)

    const { error } = await supabase
      .from("pacientes")
      .insert([
        {
          nombre: nombre,
          telefono: telefono,
          token_acceso: token,
          activo: true
        }
      ])

    if (error) {
      setMensaje("Error al guardar: " + error.message)
      setCargando(false)
      return
    }

    const link = `${window.location.origin}/paciente/${token}`
    setLinkGenerado(link)
    setMensaje("Paciente dado de alta correctamente")
    setNombre("")
    setTelefono("")
    setCargando(false)
    cargarPacientes() // Recargar la lista
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Pacientes</h1>
            <p className="text-emerald-200 text-sm">Dar de alta y gestionar</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
            ← Volver al panel
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Formulario de alta */}
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Dar de alta paciente</h2>

          <form onSubmit={darDeAlta} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nombre del paciente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (WhatsApp)</label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="55 1234 5678"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Dar de alta paciente"}
            </button>
          </form>

          {mensaje && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {mensaje}
            </div>
          )}

          {linkGenerado && (
            <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm font-medium text-blue-800 mb-2">Link mágico del paciente:</p>
              <p className="text-sm break-all bg-white p-3 rounded border text-gray-700 mb-3">
                {linkGenerado}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(linkGenerado)}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Copiar link
                </button>
                <a
                  href={`https://wa.me/52${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hola ${nombre}, este es tu acceso personal a Fisio-TRQ:\n\n${linkGenerado}\n\nAhí podrás ver tus ejercicios y citas.`
                  )}`}
                  target="_blank"
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Enviar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Lista de pacientes */}
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Pacientes registrados ({pacientes.length})
          </h2>

          {pacientes.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no hay pacientes registrados.</p>
          ) : (
            <div className="space-y-3">
              {pacientes.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-xl hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-800">{p.nombre}</p>
                    <p className="text-sm text-gray-500">{p.telefono}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/paciente/${p.token_acceso}`}
                      target="_blank"
                      className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200"
                    >
                      Ver portal
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/paciente/${p.token_acceso}`)}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200"
                    >
                      Copiar link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}