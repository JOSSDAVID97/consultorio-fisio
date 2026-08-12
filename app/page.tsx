"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function Home() {
  const [horarios, setHorarios] = useState<any[]>([])
  const [horarioId, setHorarioId] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [motivo, setMotivo] = useState("")
  const [mensaje, setMensaje] = useState("")

  const supabase = createClient()

  useEffect(() => {
    async function cargarHorarios() {
      const hoy = new Date().toISOString().split("T")[0]
      const { data } = await supabase
        .from("horarios_disponibles")
        .select("*")
        .eq("disponible", true)
        .gte("fecha", hoy)
        .order("fecha")
        .order("hora_inicio")

      if (data) setHorarios(data)
    }
    cargarHorarios()
  }, [])

  function solicitarCita(e: React.FormEvent) {
    e.preventDefault()
    const horario = horarios.find(h => h.id === horarioId)
    if (!horario) return

    const texto = `Hola, quiero agendar una cita:%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${telefono}%0A*Fecha:* ${horario.fecha}%0A*Hora:* ${horario.hora_inicio?.slice(0,5)}%0A*Motivo:* ${motivo}`

    window.open(`https://wa.me/525620251984?text=${texto}`, "_blank")
    setMensaje("Se abrió WhatsApp. Envía el mensaje para confirmar tu cita.")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fisio-TRQ" className="w-11 h-11 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-emerald-700">Fisio-TRQ</h1>
              <p className="text-xs text-gray-500">Terapia Física y Quiropraxia</p>
            </div>
          </div>
          <a href="#reservar" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Reservar cita
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
        <p className="text-emerald-600 font-medium mb-2 text-sm">Fisioterapia en Rehabilitación</p>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Recuperación profesional<br />y cercana
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Tratamientos personalizados de fisioterapia y quiropraxia para aliviar el dolor y recuperar tu movilidad.
        </p>
        <a href="#reservar" className="inline-block bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-lg font-medium shadow-lg shadow-emerald-200">
          Reservar mi cita
        </a>
      </section>

      {/* Terapeuta */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
            TG
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-800">Tadeo García Estrada</h3>
            <p className="text-emerald-600 font-medium text-sm">Fisioterapeuta</p>
            <p className="text-gray-500 text-sm mt-1">Cédula Profesional: 36349</p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Nuestros servicios</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { titulo: "Terapia Manual", desc: "Técnicas para aliviar dolores musculares y articulares." },
            { titulo: "Rehabilitación", desc: "Programas personalizados después de lesiones o cirugías." },
            { titulo: "Ejercicios en casa", desc: "Rutinas guiadas para continuar tu recuperación." }
          ].map((s) => (
            <div key={s.titulo} className="bg-white p-5 rounded-xl shadow-sm border">
              <h4 className="font-semibold mb-1">{s.titulo}</h4>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reservar cita */}
      <section id="reservar" className="max-w-lg mx-auto px-4 pb-16">
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h3 className="text-xl font-bold text-center mb-1 text-gray-800">Reservar cita</h3>
          <p className="text-center text-gray-500 text-sm mb-5">
            Elige un horario disponible
          </p>

          {horarios.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              No hay horarios disponibles por el momento. Escríbenos por WhatsApp.
            </p>
          ) : (
            <form onSubmit={solicitarCita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <select
                  required
                  value={horarioId}
                  onChange={(e) => setHorarioId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Describe brevemente tu molestia..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-700 transition"
              >
                Solicitar cita por WhatsApp
              </button>
            </form>
          )}

          {mensaje && (
            <div className="mt-4 p-3 rounded-lg text-sm bg-emerald-50 text-emerald-700 text-center">
              {mensaje}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h4 className="text-lg font-bold text-emerald-400 mb-2">Fisio-TRQ</h4>
          <p className="text-gray-400 text-sm">Tadeo García Estrada · Cédula 36349</p>
          <p className="text-gray-400 text-sm mt-1">📞 56-20-25-19-84</p>
          <p className="text-gray-400 text-sm">✉️ FISIOTRQ@GMAIL.COM</p>
        </div>
      </footer>
    </main>
  )
}