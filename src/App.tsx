import { useState } from 'react';
import Header from './Header';
import Accordion from './Accordion';
import OKRForm from './OKRForm';
import ResultSection from './ResultSection';
import Footer from './Footer';

const initialForm = {
  goal: '',
  period: '',
  currentData: '',
  targetData: '',
};

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meta: formData.goal,
          periodo: formData.period,
          atual: formData.currentData,
          metaFinal: formData.targetData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar OKR');
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || 'Erro ao gerar OKR. Tente novamente.');
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
