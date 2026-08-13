"use client"

import { useState, useEffect } from "react"

const PASSWORD = "fisio2026" // ← Cambia esta contraseña

export default function AdminPage() {
  const [autorizado, setAutorizado] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const guardado = localStorage.getItem("fisio_admin_auth")
    if (guardado === "ok") {
      setAutorizado(true)
    }
    setCargando(false)
  }, [])

  function iniciarSesion(e: React.FormEvent) {
    e.preventDefault()
    if (password === PASSWORD) {
      localStorage.setItem("fisio_admin_auth", "ok")
      setAutorizado(true)
      setError("")
    } else {
      setError("Contraseña incorrecta")
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("fisio_admin_auth")
    setAutorizado(false)
    setPassword("")
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  // Pantalla de login
  if (!autorizado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-2xl shadow-md border p-6 w-full max-w-sm">
          <h1 className="text-xl font-bold text-center text-gray-800 mb-1">Fisio-TRQ</h1>
          <p className="text-center text-gray-500 text-sm mb-6">Panel de administración</p>

          <form onSubmit={iniciarSesion} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full border rounded-xl px-4 py-3 text-sm"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Panel normal
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white">
        <div className="max-w-lg mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Fisio-TRQ</h1>
            <p className="text-emerald-200 text-sm">Panel de control</p>
          </div>
          <button onClick={cerrarSesion} className="text-xs bg-emerald-800 px-3 py-1.5 rounded-lg">
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <a href="/admin/pacientes" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">👤</div>
          <div>
            <h3 className="font-bold text-gray-800">Pacientes</h3>
            <p className="text-gray-500 text-sm">Alta y links mágicos</p>
          </div>
        </a>

        <a href="/admin/citas" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">📅</div>
          <div>
            <h3 className="font-bold text-gray-800">Citas</h3>
            <p className="text-gray-500 text-sm">Ver y agendar citas</p>
          </div>
        </a>

        <a href="/admin/ejercicios" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl">💪</div>
          <div>
            <h3 className="font-bold text-gray-800">Ejercicios</h3>
            <p className="text-gray-500 text-sm">Subir y asignar</p>
          </div>
        </a>

        <a href="/admin/horarios" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl">🕒</div>
          <div>
            <h3 className="font-bold text-gray-800">Horarios</h3>
            <p className="text-gray-500 text-sm">Días disponibles</p>
          </div>
        </a>

        <a href="/" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border mt-6">
          <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center text-xl">🌐</div>
          <div>
            <h3 className="font-bold text-gray-800">Ver sitio público</h3>
            <p className="text-gray-500 text-sm">Página de clientes</p>
          </div>
        </a>
      </div>
    </main>
  )
}