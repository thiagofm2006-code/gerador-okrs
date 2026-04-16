import { useState } from 'react';
import Header from './components/Header';
import Accordion from './components/Accordion';
import OKRForm, { FormData } from './components/OKRForm';
import ResultSection from './components/ResultSection';
import Footer from './components/Footer';
import { supabase } from './lib/supabase';

const initialForm: FormData = {
  goal: '',
  period: '',
  currentData: '',
  targetData: '',
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-okr', {
        body: {
          goal: formData.goal,
          period: formData.period,
          currentData: formData.currentData,
          targetData: formData.targetData,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.result) throw new Error('Resposta inválida da IA.');

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar OKR. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Header />
        <Accordion />
        <OKRForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleGenerate}
          loading={loading}
        />
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-4">
            {error}
          </div>
        )}
        {result && <ResultSection result={result} />}
        <Footer />
      </div>
    </div>
  );
}
