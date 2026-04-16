import { useState } from 'react';
import { Copy } from 'lucide-react';

interface ResultSectionProps {
  result: string;
}

function parseSections(text: string) {
  const lines = text.split('\n');

  const krs: { kr: string; kpi: string }[] = [];
  const pontos: string[] = [];
  const plano: string[] = [];

  let okr = '';
  let currentKR = '';
  let currentKPI = '';
  let section = '';

  lines.forEach((line) => {
    const l = line.trim();
    if (!l) return;

    if (l.startsWith('OKR')) {
      okr = l;
      return;
    }

    if (l.startsWith('KR')) {
      if (currentKR || currentKPI) {
        krs.push({ kr: currentKR, kpi: currentKPI });
      }
      currentKR = l;
      currentKPI = '';
      section = 'kr';
      return;
    }

    if (l.startsWith('KPI')) {
      currentKPI = l;
      section = 'kpi';
      return;
    }

    if (l.includes('Pontos de Atenção')) {
      if (currentKR || currentKPI) {
        krs.push({ kr: currentKR, kpi: currentKPI });
      }
      section = 'pontos';
      return;
    }

    if (l.includes('Plano de Ação')) {
      section = 'plano';
      return;
    }

    if (section === 'kr') currentKR += '\n' + l;
    else if (section === 'kpi') currentKPI += '\n' + l;
    else if (section === 'pontos') pontos.push(l);
    else if (section === 'plano') plano.push(l);
  });

  if (currentKR || currentKPI) {
    krs.push({ kr: currentKR, kpi: currentKPI });
  }

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
        margin: 10,
        filename: 'okr.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
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
            className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>

          <button
            onClick={handleExportPDF}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Exportar PDF
          </button>
        </div>
      </section>

      {/* UI */}
      <div className="space-y-5">

        {/* OKR */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="font-semibold">{parsed.okr}</p>
        </div>

        {/* KR + KPI AGRUPADOS */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-blue-700 mb-4">
            Resultados-chave e KPIs
          </h3>

          <div className="space-y-4">
            {parsed.krs.map((item, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-4"
              >
                <p className="font-semibold whitespace-pre-line">
                  {item.kr}
                </p>

                <p className="text-sm mt-2 whitespace-pre-line text-gray-600">
                  {item.kpi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pontos */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-yellow-700 mb-3">
            Pontos de Atenção
          </h3>

          <div className="space-y-2 whitespace-pre-line text-sm">
            {parsed.pontos.join('\n')}
          </div>
        </div>

        {/* Plano */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-green-700 mb-3">
            Plano de Ação
          </h3>

          <div className="space-y-2 whitespace-pre-line text-sm">
            {parsed.plano.join('\n')}
          </div>
        </div>
      </div>

      {/* PDF (IMPORTANTE: NÃO hidden) */}
      <div id="pdf-content" className="bg-white p-8 text-black mt-10">

        <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>
          OKR
        </h1>
        <p>{parsed.okr}</p>

        <h2 style={{ marginTop: '20px' }}>
          Resultados-chave e KPIs
        </h2>

        {parsed.krs.map((item, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <pre>{item.kr}</pre>
            <pre>{item.kpi}</pre>
          </div>
        ))}

        <h2>Pontos de Atenção</h2>
        <pre>{parsed.pontos.join('\n')}</pre>

        <h2>Plano de Ação</h2>
        <pre>{parsed.plano.join('\n')}</pre>
      </div>
    </>
  );
}
