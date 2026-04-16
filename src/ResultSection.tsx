import { useState } from 'react';

interface ResultSectionProps {
  result: string;
}

function parseSections(text: string) {
  const lines = text.split('\n');

  const krs: {
    krTitle: string;
    krDesc: string;
    kpiTitle: string;
    kpiDesc: string;
  }[] = [];

  const pontos: string[] = [];
  const plano: string[] = [];

  let okr = '';

  let currentKRTitle = '';
  let currentKRDesc = '';
  let currentKPITitle = '';
  let currentKPIDesc = '';

  let section = '';

  lines.forEach((line) => {
    const l = line.trim();
    if (!l) return;

    if (l.startsWith('OKR')) {
      okr = l;
      return;
    }

    if (l.startsWith('KR')) {
      if (currentKRTitle) {
        krs.push({
          krTitle: currentKRTitle,
          krDesc: currentKRDesc,
          kpiTitle: currentKPITitle,
          kpiDesc: currentKPIDesc,
        });
      }

      currentKRTitle = l;
      currentKRDesc = '';
      currentKPITitle = '';
      currentKPIDesc = '';
      section = 'kr';
      return;
    }

    if (l.startsWith('KPI')) {
      currentKPITitle = l;
      section = 'kpi';
      return;
    }

    if (l.includes('Pontos de Atenção')) {
      if (currentKRTitle) {
        krs.push({
          krTitle: currentKRTitle,
          krDesc: currentKRDesc,
          kpiTitle: currentKPITitle,
          kpiDesc: currentKPIDesc,
        });
      }
      section = 'pontos';
      return;
    }

    if (l.includes('Plano de Ação')) {
      section = 'plano';
      return;
    }

    if (section === 'kr') currentKRDesc += ' ' + l;
    else if (section === 'kpi') currentKPIDesc += ' ' + l;
    else if (section === 'pontos') pontos.push(l);
    else if (section === 'plano') plano.push(l);
  });

  if (currentKRTitle) {
    krs.push({
      krTitle: currentKRTitle,
      krDesc: currentKRDesc,
      kpiTitle: currentKPITitle,
      kpiDesc: currentKPIDesc,
    });
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

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-semibold text-gray-400 uppercase">
          Resultado
        </h2>

        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 border rounded hover:bg-gray-50"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      {/* OKR */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <p className="font-semibold">{parsed.okr}</p>
      </div>

      {/* KR + KPI */}
      <div className="bg-blue-50 border rounded-2xl p-6">
        <h3 className="font-semibold mb-4 text-blue-700">
          Resultados-chave e KPIs
        </h3>

        {parsed.krs.map((item, i) => (
          <div key={i} className="mb-4 bg-white p-5 rounded-xl border shadow-sm">
            <p className="font-semibold">{item.krTitle}</p>
            <p className="text-sm text-gray-600">{item.krDesc}</p>

            <p className="font-semibold mt-3">{item.kpiTitle}</p>
            <p className="text-sm text-gray-600">{item.kpiDesc}</p>
          </div>
        ))}
      </div>

      {/* PONTOS */}
      <div className="bg-yellow-50 border rounded-2xl p-6">
        <h3 className="font-semibold text-yellow-700 mb-2">
          Pontos de Atenção
        </h3>

        {pontos.map((p, i) => (
          <p key={i} className="text-sm">{p}</p>
        ))}
      </div>

      {/* PLANO */}
      <div className="bg-green-50 border rounded-2xl p-6">
        <h3 className="font-semibold text-green-700 mb-2">
          Plano de Ação
        </h3>

        {plano.map((p, i) => (
          <p key={i} className="text-sm">{p}</p>
        ))}
      </div>

    </div>
  );
}
