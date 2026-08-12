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
  const [mostrarForm, setMostrarForm] = useState(false)

  const supabase = createClient()

  async function cargarPacientes() {
    const { data } = await supabase
      .from("pacientes")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setPacientes(data)
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

    const { error } = await supabase.from("pacientes").insert([
      { nombre, telefono, token_acceso: token, activo: true }
    ])

    if (error) {
      setMensaje("Error: " + error.message)
    } else {
      const link = `${window.location.origin}/paciente/${token}`
      setLinkGenerado(link)
      setMensaje("Paciente creado")
      setNombre("")
      setTelefono("")
      setMostrarForm(false)
      cargarPacientes()
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Pacientes</h1>
            <p className="text-emerald-200 text-xs">{pacientes.length} registrados</p>
          </div>
          <a href="/admin" className="text-sm bg-emerald-600 px-3 py-1.5 rounded-lg">← Volver</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Botón para mostrar formulario */}
        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-medium"
          >
            + Dar de alta paciente
          </button>
        )}

        {/* Formulario */}
        {mostrarForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-800 mb-4">Nuevo paciente</h2>
            <form onSubmit={darDeAlta} className="space-y-3">
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="WhatsApp"
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />
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
                  {cargando ? "Guardando..." : "Guardar"}
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

        {linkGenerado && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Link del paciente:</p>
            <p className="text-xs break-all bg-white p-3 rounded-xl mb-3">{linkGenerado}</p>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(linkGenerado)}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm"
              >
                Copiar link
              </button>
              <a
                href={`https://wa.me/52${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hola ${nombre}, este es tu acceso a Fisio-TRQ:\n\n${linkGenerado}`
                )}`}
                target="_blank"
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm text-center"
              >
                Enviar WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="space-y-3 pt-2">
          {pacientes.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border">
              <p className="font-medium text-gray-800">{p.nombre}</p>
              <p className="text-sm text-gray-500 mb-3">{p.telefono}</p>
              <div className="flex gap-2">
                <a
                  href={`/paciente/${p.token_acceso}`}
                  target="_blank"
                  className="flex-1 text-center text-sm bg-emerald-50 text-emerald-700 py-2 rounded-xl"
                >
                  Ver portal
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/paciente/${p.token_acceso}`)}
                  className="flex-1 text-sm bg-gray-50 text-gray-700 py-2 rounded-xl"
                >
                  Copiar link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}