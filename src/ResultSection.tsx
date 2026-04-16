import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultSectionProps {
  result: string;
}

function parseSections(text: string) {
  const parts = text.split('\n');

  let okr = '';
  const krs: string[] = [];
  const pontos: string[] = [];
  const plano: string[] = [];

  let section = '';

  parts.forEach((line) => {
    if (line.startsWith('OKR')) {
      okr = line;
      section = 'okr';
    } else if (line.startsWith('KR') || line.startsWith('KPI')) {
      section = 'kr';
      krs.push(line);
    } else if (line.includes('Pontos de Atenção')) {
      section = 'pontos';
    } else if (line.includes('Plano de Ação')) {
      section = 'plano';
    } else {
      if (section === 'kr') krs.push(line);
      if (section === 'pontos') pontos.push(line);
      if (section === 'plano') plano.push(line);
    }
  });

  return { okr, krs, pontos, plano };
}

export default function ResultSection({ result }: ResultSectionProps) {
  const [copied, setCopied] = useState(false);
  const parsed = parseSections(result);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-content');
    const html2pdf = (window as any).html2pdf;

    html2pdf()
      .set({
        margin: 0.3,
        filename: 'okr.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 2,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(element)
      .save();
  };

  return (
    <>
      {/* HEADER */}
      <section className="mb-6 flex justify-between items-center">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Resultado
        </h2>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Exportar PDF
          </button>
        </div>
      </section>

      {/* UI BONITA */}
      <div className="space-y-5">

        {/* OKR */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-400 mb-2">Objetivo</h3>
          <p className="text-gray-900 font-semibold">{parsed.okr}</p>
        </div>

        {/* KR + KPI */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="text-sm text-blue-600 font-semibold mb-3">
            Resultados-chave e KPIs
          </h3>

          <div className="space-y-2 text-sm text-gray-700 whitespace-pre-line">
            {parsed.krs.join('\n')}
          </div>
        </div>

        {/* Pontos */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
          <h3 className="text-sm text-yellow-700 font-semibold mb-3">
            Pontos de Atenção
          </h3>

          <div className="space-y-2 text-sm whitespace-pre-line">
            {parsed.pontos.join('\n')}
          </div>
        </div>

        {/* Plano */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
          <h3 className="text-sm text-green-700 font-semibold mb-3">
            Plano de Ação
          </h3>

          <div className="space-y-2 text-sm whitespace-pre-line">
            {parsed.plano.join('\n')}
          </div>
        </div>
      </div>

      {/* PDF OTIMIZADO */}
      <div
        id="pdf-content"
        className="hidden print:block bg-white p-8 text-black"
      >
        <div style={{ pageBreakAfter: 'always' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>OKR</h1>
          <p>{parsed.okr}</p>
        </div>

        <div style={{ pageBreakAfter: 'always' }}>
          <h2>Resultados-chave e KPIs</h2>
          <pre>{parsed.krs.join('\n')}</pre>
        </div>

        <div style={{ pageBreakAfter: 'always' }}>
          <h2>Pontos de Atenção</h2>
          <pre>{parsed.pontos.join('\n')}</pre>
        </div>

        <div>
          <h2>Plano de Ação</h2>
          <pre>{parsed.plano.join('\n')}</pre>
        </div>
      </div>
    </>
  );
}
