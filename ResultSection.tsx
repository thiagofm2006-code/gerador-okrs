import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultSectionProps {
  result: string;
}

function formatResult(text: string) {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    if (line.startsWith('## ')) {
      return (
        <h3 key={index} className="text-base font-semibold text-gray-800 mt-5 mb-2 first:mt-0">
          {line.replace('## ', '')}
        </h3>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h2 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-2 first:mt-0">
          {line.replace('# ', '')}
        </h2>
      );
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={index} className="font-semibold text-gray-800 mt-3 mb-1">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const content = line.replace(/^[-•]\s/, '');
      const parts = content.split(/(\*\*[^*]+\*\*)/g);
      return (
        <li key={index} className="text-gray-600 text-sm ml-4 mb-1 list-disc">
          {parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className="text-gray-800 font-semibold">
                {part.replace(/\*\*/g, '')}
              </strong>
            ) : (
              part
            )
          )}
        </li>
      );
    }
    if (line.trim() === '') {
      return <div key={index} className="h-1" />;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={index} className="text-gray-600 text-sm mb-1 leading-relaxed">
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i} className="text-gray-800 font-semibold">
              {part.replace(/\*\*/g, '')}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default function ResultSection({ result }: ResultSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Resultado</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-500" />
              <span className="text-green-600">Copiado!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              Copiar resultado
            </>
          )}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="prose prose-sm max-w-none">{formatResult(result)}</div>
      </div>
    </section>
  );
}
