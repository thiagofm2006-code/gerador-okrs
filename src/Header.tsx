export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-100">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
        Powered by IA
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
        Gerador de OKR com IA
      </h1>
      <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
        Transforme metas em OKRs claros, mensuráveis e estratégicos
      </p>
    </header>
  );
}
