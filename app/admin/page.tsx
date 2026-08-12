export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-emerald-700 text-white">
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="text-xl font-bold">Fisio-TRQ</h1>
          <p className="text-emerald-200 text-sm">Panel de control</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">

        <a href="/admin/pacientes" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border active:bg-gray-50">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Pacientes</h3>
            <p className="text-gray-500 text-sm">Alta y links mágicos</p>
          </div>
        </a>

        <a href="/admin/citas" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border active:bg-gray-50">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
            📅
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Citas</h3>
            <p className="text-gray-500 text-sm">Ver y agendar citas</p>
          </div>
        </a>

        <a href="/admin/ejercicios" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border active:bg-gray-50">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl">
            💪
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Ejercicios</h3>
            <p className="text-gray-500 text-sm">Subir y asignar</p>
          </div>
        </a>

        <a href="/admin/horarios" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border active:bg-gray-50">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl">
            🕒
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Horarios</h3>
            <p className="text-gray-500 text-sm">Días disponibles</p>
          </div>
        </a>

        <a href="/" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border active:bg-gray-50 mt-6">
          <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center text-xl">
            🌐
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Ver sitio público</h3>
            <p className="text-gray-500 text-sm">Página de clientes</p>
          </div>
        </a>

      </div>
    </main>
  )
}