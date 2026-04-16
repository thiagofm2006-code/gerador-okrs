import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultSectionProps {
  result: string;
}

// 🔥 PARSER PROFISSIONAL
function parseOKR(text: string) {
  const normalized = text.replace(/\r/g, '');

  const lines = normalized.split('\n');

  const okr = '';
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
      currentSection = 'okr';
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

    if (currentSection === 'kr') {
      currentKR += '\n' + line;
    } else if (currentSection === 'kpi') {
      currentKPI += '\n' + line;
    } else if (currentSection === 'pontos') {
      pontos.push(line);
    } else if (currentSection === 'plano') {
      plano.push(line);
    }
  }

  if (currentKR || currentKPI) {
    krs.push({ kr: currentKR, kpi: currentKPI });
  }

  return {
    okr: okrTitle,
    krs,
    pontos,
    plano,
  };
}

export default function ResultSection({ result }: ResultSectionProps) {
  const [copied, setCopied] = useState(false);

  const parsed = parseOKR(result);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-8 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Resultado
        </h2>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-500" />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={13} />
              Copiar
            </>
          )}
        </button>
      </div>

      {/* OKR */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm text-gray-400 mb-2">OKR</h3>
        <p className="text-lg font-semibold text-gray-900">
          {parsed.okr}
        </p>
      </div>

      {/* KRs + KPIs */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm text-gray-400 mb-4">Resultados-chave</h3>

        <div className="space-y-5">
          {parsed.krs.map((item, index) => (
            <div key={index} className="p-4 rounded-xl border bg-gray-50">

              <div className="mb-2">
                <p className="text-sm font-semibold text-gray-800 whitespace-pre-line">
                  {item.kr}
                </p>
              </div>

              <div className="border-t pt-2 mt-2">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {item.kpi}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Pontos de Atenção */}
      <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-yellow-700 mb-3">
          Pontos de Atenção
        </h3>

        <div className="space-y-2">
          {parsed.pontos.map((item, index) => (
            <p key={index} className="text-sm text-yellow-800 whitespace-pre-line">
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* Plano de Ação */}
      <div className="border border-green-200 bg-green-50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-green-700 mb-3">
          Plano de Ação
        </h3>

        <div className="space-y-2">
          {parsed.plano.map((item, index) => (
            <p key={index} className="text-sm text-green-800 whitespace-pre-line">
              {item}
            </p>
          ))}
        </div>
      </div>

    </section>
  );
}
