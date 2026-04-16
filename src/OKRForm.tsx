import { Loader2 } from 'lucide-react';

interface FormData {
  goal: string;
  period: string;
  currentData: string;
  targetData: string;
}

interface Props {
  formData: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function OKRForm({
  formData,
  onChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-5">

      <h2 className="text-lg font-semibold text-gray-800">
        Defina sua meta
      </h2>

      {/* META */}
      <div>
        <label className="text-sm text-gray-500">Meta</label>
        <input
          type="text"
          value={formData.goal}
          onChange={(e) => onChange({ ...formData, goal: e.target.value })}
          placeholder="Ex: Aumentar NPS"
          className="mt-1 w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* PERIODO */}
      <div>
        <label className="text-sm text-gray-500">Período</label>
        <select
          value={formData.period}
          onChange={(e) => onChange({ ...formData, period: e.target.value })}
          className="mt-1 w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Selecione</option>
          <option value="1">1 mês</option>
          <option value="2">2 meses</option>
          <option value="3">3 meses</option>
          <option value="6">6 meses</option>
          <option value="12">12 meses</option>
        </select>
      </div>

      {/* ATUAL */}
      <div>
        <label className="text-sm text-gray-500">Dado atual</label>
        <input
          type="text"
          value={formData.currentData}
          onChange={(e) => onChange({ ...formData, currentData: e.target.value })}
          placeholder="Ex: NPS 30"
          className="mt-1 w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* META FINAL */}
      <div>
        <label className="text-sm text-gray-500">Meta desejada</label>
        <input
          type="text"
          value={formData.targetData}
          onChange={(e) => onChange({ ...formData, targetData: e.target.value })}
          placeholder="Ex: NPS 60"
          className="mt-1 w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* BOTÃO */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando...
          </>
        ) : (
          'Gerar OKR'
        )}
      </button>

    </div>
  );
}
