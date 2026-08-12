"use client"
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center gap-3">
  <img 
    src="/logo.jpg" 
    alt="Fisio-TRQ" 
    className="w-12 h-12 object-contain"
  />
  <div>
    <h1 className="text-xl font-bold text-emerald-700">Fisio-TRQ</h1>
    <p className="text-xs text-gray-500">Terapia Física y Quiropraxia</p>
  </div>
</div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
        <p className="text-emerald-600 font-medium mb-3">Fisioterapia en Rehabilitación</p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Recuperación profesional<br />y cercana
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Tratamientos personalizados de fisioterapia y quiropraxia para aliviar el dolor y recuperar tu movilidad.
        </p>
        <a 
          href="#agendar"
          className="inline-block bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          Agendar mi primera cita
        </a>
      </section>

      {/* Sobre el terapeuta */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0">
            TG
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-800">Tadeo García Estrada</h3>
            <p className="text-emerald-600 font-medium mt-1">Fisioterapeuta</p>
            <p className="text-gray-600 text-sm mt-2">
              Fisioterapia en Rehabilitación y Terapia Física
            </p>
            <p className="text-gray-500 text-sm mt-1">Cédula Profesional: 36349</p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Nuestros servicios</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">🦴</div>
            <h4 className="font-semibold text-lg mb-2">Terapia Manual</h4>
            <p className="text-gray-600 text-sm">Técnicas especializadas para aliviar dolores musculares y articulares.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">💪</div>
            <h4 className="font-semibold text-lg mb-2">Rehabilitación</h4>
            <p className="text-gray-600 text-sm">Programas personalizados después de lesiones o cirugías.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">🏠</div>
            <h4 className="font-semibold text-lg mb-2">Ejercicios en casa</h4>
            <p className="text-gray-600 text-sm">Rutinas guiadas para continuar tu recuperación desde casa.</p>
          </div>
        </div>
      </section>

      {/* Agendar */}
      <section id="agendar" className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-md border">
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">Agendar cita</h3>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Completa el formulario y te contactaremos por WhatsApp
          </p>
          
          <form 
  className="space-y-4"
  onSubmit={(e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
    const telefono = (form.elements.namedItem('telefono') as HTMLInputElement).value;
    const motivo = (form.elements.namedItem('motivo') as HTMLTextAreaElement).value;

    const mensaje = `Hola, soy *${nombre}*.%0A%0ATeléfono: ${telefono}%0A%0AMotivo de consulta:%0A${motivo}%0A%0AQuiero agendar una cita.`;
    
    window.open(`https://wa.me/525620251984?text=${mensaje}`, '_blank');
  }}
>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
    <input 
      type="text" 
      name="nombre"
      required
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      placeholder="Tu nombre"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (WhatsApp)</label>
    <input 
      type="tel" 
      name="telefono"
      required
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      placeholder="55 1234 5678"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta</label>
    <textarea 
      name="motivo"
      required
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      rows={3}
      placeholder="Describe brevemente tu molestia..."
    ></textarea>
  </div>
  <button 
    type="submit"
    className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-medium hover:bg-emerald-700 transition"
  >
    Enviar por WhatsApp
  </button>
</form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h4 className="text-lg font-bold text-emerald-400 mb-2">Fisio-TRQ</h4>
          <p className="text-gray-400 text-sm mb-1">Tadeo García Estrada · Cédula 36349</p>
          <p className="text-gray-400 text-sm mb-1">📞 56-20-25-19-84</p>
          <p className="text-gray-400 text-sm">✉️ FISIOTRQ@GMAIL.COM</p>
          <p className="text-gray-500 text-xs mt-4">© 2026 Fisio-TRQ · Fisioterapia y Quiropraxia</p>
        </div>
      </footer>
    </main>
  )
}