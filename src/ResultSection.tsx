import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ResultSectionProps {
  result: string;
}

function parseOKR(text: string) {
  const normalized = text.replace(/\r/g, '');
  const lines = normalized.split('\n');

  const krs: { kr: string; kpi: string }[] = [];
  const pontos: string[] = [];
  const plano: string[] = [];

  let currentKR = '';
  let currentKPI = '';
  let currentSection = 'okr';
  let okrTitle = '';

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('OKR')) {
      okrTitle = line;
      continue;
    }

    if (line.startsWith('KR')) {
      if (currentKR || currentKPI) {
        krs.push({ kr: currentKR, kpi: currentKPI });
        currentKR = '';
        currentKPI = '';
      }
      currentSection = 'kr';
      currentKR = line;
      continue;
    }

    if (line.startsWith('KPI')) {
      currentSection = 'kpi';
      currentKPI = line;
      continue;
    }

    if (line.includes('Pontos de Atenção')) {
      if (currentKR || currentKPI) {
        krs.push({ kr: currentKR, kpi: currentKPI });
      }
      currentSection = 'pontos';
      continue;
    }

    if (line.includes('Plano de Ação')) {
      currentSection = 'plano';
      continue;
    }

    if (currentSection === 'kr') currentKR += '\n' + line;
    else if (currentSection === 'kpi') currentKPI += '\n' + line;
    else if (currentSection === 'pontos') pontos.push(line);
    else if (currentSection === 'plano') plano.push(line);
  }

  if (currentKR || currentKPI) {
    krs.push({ kr: currentKR, kpi: currentKPI });
  }

  return { okr: okrTitle, krs, pontos, plano };
}

export default function ResultSection({ result }: ResultSectionProps) {
  const [copied, setCopied] = useState(false);
  const parsed = parseOKR(result);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: 'okr.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4' },
      })
      .from(element)
      .save();
  };

  return (
    <>
      {/* UI NORMAL */}
      <section className="mb-8 space-y-6">
        <div className="flex justify-between">
          <h2 className="text-xs text-gray-400 uppercase">Resultado</h2>

          <div className="flex gap-2">
            <button onClick={handleCopy} className="text-xs text-gray-500 hover:text-blue-600">
              {copied ? 'Copiado!' : 'Copiar'}
            </button>

            <button onClick={handleExportPDF} className="text-xs text-green-600">
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="font-semibold">{parsed.okr}</p>
        </div>
      </section>

      {/* 🔥 VERSÃO LIMPA DO PDF */}
      <div id="pdf-content" className="p-8 bg-white text-black">

        {/* OKR */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">OKR</h1>
          <p className="text-lg">{parsed.okr}</p>
        </div>

        {/* KRs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Resultados-Chave</h2>

          <div className="space-y-4">
            {parsed.krs.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold whitespace-pre-line">{item.kr}</p>
                <p className="text-sm mt-1 whitespace-pre-line">{item.kpi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pontos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700">
            Pontos de Atenção
          </h2>

          <div className="space-y-2">
            {parsed.pontos.map((item, index) => (
              <p key={index} className="text-sm whitespace-pre-line">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Plano */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Plano de Ação
          </h2>

          <div className="space-y-2">
            {parsed.plano.map((item, index) => (
              <p key={index} className="text-sm whitespace-pre-line">
                {item}
              </p>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
