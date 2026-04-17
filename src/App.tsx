import { useState } from 'react';
import Header from './Header';
import Accordion from './Accordion';
import OKRForm from './OKRForm';
import ResultSection from './ResultSection';

const initialForm = {
  goal: '',
  period: '',
  currentData: '',
  targetData: '',
};

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        // ✅ AQUI está a correção (mapeamento correto)
        body: JSON.stringify({
          meta: formData.goal,
          periodo: formData.period,
          atual: formData.currentData,
          metaFinal: formData.targetData,
        }),
      });

      const data = await response.json();

      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar OKR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <Header />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">

          {/* FORM */}
          <div className="sticky top-6 h-fit">
            <OKRForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              loading={loading}
            />
          </div>

          {/* RESULTADO */}
          <div className="transition-all duration-300">
            {result ? (
              <ResultSection result={result} />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed rounded-2xl p-12 text-gray-400 text-sm">
                Sua OKR aparecerá aqui 🚀
              </div>
            )}
          </div>

        </div>

        <div className="mt-16">
          <Accordion />
        </div>

      </div>
    </div>
  );
}
