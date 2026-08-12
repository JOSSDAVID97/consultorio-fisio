export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <header className="bg-emerald-700 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Fisio-TRQ · Panel Admin</h1>
            <p className="text-emerald-200 text-sm">Tadeo García Estrada</p>
          </div>
          <a href="/" className="text-sm bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
            Ver sitio público
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Pacientes activos</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Citas de hoy</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Ejercicios subidos</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">0</p>
          </div>
        </div>

        {/* Menú de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/admin/pacientes" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition block">
            <h3 className="font-bold text-lg text-gray-800">Pacientes</h3>
            <p className="text-gray-500 text-sm mt-1">Dar de alta, ver y gestionar pacientes</p>
          </a>

          <a href="/admin/citas" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition block">
            <h3 className="font-bold text-lg text-gray-800">Citas</h3>
            <p className="text-gray-500 text-sm mt-1">Ver agenda y programar citas</p>
          </a>

          <a href="/admin/ejercicios" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition block">
            <h3 className="font-bold text-lg text-gray-800">Ejercicios</h3>
            <p className="text-gray-500 text-sm mt-1">Subir y asignar ejercicios a pacientes</p>
          </a>

          <a href="/admin/horarios" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition block">
            <h3 className="font-bold text-lg text-gray-800">Horarios</h3>
            <p className="text-gray-500 text-sm mt-1">Configurar días y horas disponibles</p>
          </a>
        </div>
      </div>
    </main>
  )
}
