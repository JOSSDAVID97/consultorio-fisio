"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function Home() {
  const [horarios, setHorarios] = useState<any[]>([])
  const [diasDisponibles, setDiasDisponibles] = useState<string[]>([])
  const [diaSeleccionado, setDiaSeleccionado] = useState("")
  const [horaSeleccionada, setHoraSeleccionada] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [motivo, setMotivo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [mesActual, setMesActual] = useState(new Date())

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

      if (data) {
        setHorarios(data)
        const dias = [...new Set(data.map((h: any) => h.fecha))]
        setDiasDisponibles(dias)
      }
    }
    cargarHorarios()
  }, [])

  // Generar días del mes para el calendario
  function generarDiasDelMes() {
    const year = mesActual.getFullYear()
    const month = mesActual.getMonth()
    const primerDia = new Date(year, month, 1)
    const ultimoDia = new Date(year, month + 1, 0)
    const diasEnMes = ultimoDia.getDate()
    const diaSemanaInicio = primerDia.getDay() // 0 = domingo

    const dias: (number | null)[] = []

    // Espacios vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null)
    }

    // Días del mes
    for (let d = 1; d <= diasEnMes; d++) {
      dias.push(d)
    }

    return dias
  }

  function formatoFecha(dia: number) {
    const year = mesActual.getFullYear()
    const month = String(mesActual.getMonth() + 1).padStart(2, "0")
    const day = String(dia).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function mesAnterior() {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))
    setDiaSeleccionado("")
    setHoraSeleccionada("")
  }

  function mesSiguiente() {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))
    setDiaSeleccionado("")
    setHoraSeleccionada("")
  }

 async function solicitarCita(e: React.FormEvent) {
  e.preventDefault()
  if (!diaSeleccionado || !horaSeleccionada) return

  setMensaje("Procesando...")

  // Buscar el horario exacto
  const horario = horarios.find(
    (h) => h.fecha === diaSeleccionado && h.hora_inicio?.slice(0, 5) === horaSeleccionada
  )

  if (!horario) {
    setMensaje("Ese horario ya no está disponible")
    return
  }

  // 1. Marcar el horario como no disponible
  const { error: errorHorario } = await supabase
    .from("horarios_disponibles")
    .update({ disponible: false })
    .eq("id", horario.id)

  if (errorHorario) {
    setMensaje("Error al reservar. Intenta de nuevo.")
    return
  }

  // 2. Crear la cita automáticamente
  await supabase.from("citas").insert([
    {
      fecha: diaSeleccionado,
      hora: horaSeleccionada + ":00",
      notas: `Cliente nuevo: ${nombre} | Tel: ${telefono} | Motivo: ${motivo}`,
      estado: "programada"
    }
  ])

  // 3. Abrir WhatsApp
  const texto = `Hola, quiero agendar una cita:%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${telefono}%0A*Fecha:* ${diaSeleccionado}%0A*Hora:* ${horaSeleccionada}%0A*Motivo:* ${motivo}`

  window.open(`https://wa.me/525620251984?text=${texto}`, "_blank")

  setMensaje("¡Cita reservada! Se abrió WhatsApp para que envíes el mensaje y confirmes.")

  // Actualizar lista local
  setHorarios(prev => prev.filter(h => h.id !== horario.id))
  setHoraSeleccionada("")
  setNombre("")
  setTelefono("")
  setMotivo("")
}

  const nombresMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const diasSemana = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
  const horariosDelDia = horarios.filter(h => h.fecha === diaSeleccionado)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Fisio-TRQ" className="w-11 h-11 object-contain" />
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
      <section className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-emerald-600 font-medium mb-2 text-sm">Fisioterapia en Rehabilitación</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Recuperación profesional y cercana
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto text-sm md:text-base">
          Tratamientos personalizados de fisioterapia y quiropraxia.
        </p>
        <a href="#reservar" className="inline-block bg-emerald-600 text-white px-7 py-3 rounded-xl font-medium shadow-lg shadow-emerald-200">
          Reservar mi cita
        </a>
      </section>

      {/* Terapeuta */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex gap-4 items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0">
            TG
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Tadeo García Estrada</h3>
            <p className="text-emerald-600 text-sm">Fisioterapeuta · Cédula 36349</p>
          </div>
        </div>
      </section>

      {/* Reservar */}
      <section id="reservar" className="max-w-lg mx-auto px-4 pb-16">
        <div className="bg-white p-5 rounded-2xl shadow-md border">
          <h3 className="text-xl font-bold text-center mb-1 text-gray-800">Reservar cita</h3>
          <p className="text-center text-gray-500 text-sm mb-5">Selecciona un día disponible</p>

          {/* Calendario */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <button onClick={mesAnterior} className="px-3 py-1 text-sm border rounded-lg">←</button>
              <span className="font-medium text-gray-800">
                {nombresMes[mesActual.getMonth()]} {mesActual.getFullYear()}
              </span>
              <button onClick={mesSiguiente} className="px-3 py-1 text-sm border rounded-lg">→</button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
              {diasSemana.map(d => (
                <div key={d} className="py-1 text-gray-500 font-medium">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generarDiasDelMes().map((dia, i) => {
                if (dia === null) return <div key={i} />
                const fecha = formatoFecha(dia)
                const disponible = diasDisponibles.includes(fecha)
                const seleccionado = diaSeleccionado === fecha

                return (
                  <button
                    key={i}
                    disabled={!disponible}
                    onClick={() => {
                      setDiaSeleccionado(fecha)
                      setHoraSeleccionada("")
                    }}
                    className={`
                      py-2 rounded-lg text-sm font-medium transition
                      ${seleccionado ? "bg-emerald-600 text-white" : ""}
                      ${disponible && !seleccionado ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : ""}
                      ${!disponible ? "text-gray-300 cursor-not-allowed" : ""}
                    `}
                  >
                    {dia}
                  </button>
                )
              })}
            </div>
          </div>


          {/* Horarios del día */}
          {diaSeleccionado && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Horarios disponibles el {diaSeleccionado}:
              </p>
              {horariosDelDia.length === 0 ? (
                <p className="text-sm text-gray-500">No hay horarios este día.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {horariosDelDia.map((h) => {
                    const hora = h.hora_inicio?.slice(0, 5)
                    const seleccionado = horaSeleccionada === hora
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHoraSeleccionada(hora)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                          ${seleccionado ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-700 hover:border-emerald-400"}
                        `}
                      >
                        {hora}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Formulario de datos */}
          {horaSeleccionada && (
            <form onSubmit={solicitarCita} className="space-y-3 border-t pt-4">
              <p className="text-sm text-emerald-700 font-medium">
                Cita: {diaSeleccionado} a las {horaSeleccionada}
              </p>

              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              />
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="WhatsApp"
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              />
              <textarea
                required
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={2}
                placeholder="Motivo de consulta"
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium"
              >
                Confirmar por WhatsApp
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