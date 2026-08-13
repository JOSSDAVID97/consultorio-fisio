"use client"

import { useState, useEffect } from "react"

const PASSWORD = "fisioTQR" // ← Cambia esta contraseña por la que quieras

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
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

  return (
    <div>
      {/* Botón de cerrar sesión */}
      <div className="bg-gray-800 text-white text-xs px-4 py-2 flex justify-between items-center">
        <span>Admin conectado</span>
        <button onClick={cerrarSesion} className="underline">
          Cerrar sesión
        </button>
      </div>
      {children}
    </div>
  )
}