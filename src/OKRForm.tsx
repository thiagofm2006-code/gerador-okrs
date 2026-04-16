import { Loader2, Sparkles } from 'lucide-react';

export interface FormData {
  goal: string;
  period: string;
  currentData: string;
  targetData: string;
}

interface OKRFormProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  loading: boolean;
}

const periodOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1} ${i + 1 === 1 ? 'mês' : 'meses'}`,
}));

export default function OKRForm({ formData, onChange, onSubmit, loading }: OKRFormProps) {
  const hasAtLeastOne =
    formData.goal.trim() !== '' ||
    formData.period !== '' ||
    formData.currentData.trim() !== '' ||
    formData.targetData.trim() !== '';

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 focus:border-blue-400 focus:ring-3 focus:ring-blue-100';

  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Gerar OKR</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explique sua meta
          </label>
          <p className="text-xs text-gray-400 mb-2">Descreva o objetivo que você quer alcançar no produto ou negócio</p>
          <textarea
            className={`${inputBase} min-h-[90px] resize-none`}
            placeholder="Ex: Melhorar a ativação de novos usuários"
            value={formData.goal}
            onChange={(e) => onChange({ ...formData, goal: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <p className="text-xs text-gray-400 mb-2">Tempo disponível para atingir o objetivo</p>
          <select
            className={`${inputBase} cursor-pointer`}
            value={formData.period}
            onChange={(e) => onChange({ ...formData, period: e.target.value })}
          >
            <option value="">Selecione o período</option>
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dado atual
            </label>
            <p className="text-xs text-gray-400 mb-2">Informe a situação atual com um valor mensurável</p>
            <input
              type="text"
              className={inputBase}
              placeholder="Ex: 40% de ativação"
              value={formData.currentData}
              onChange={(e) => onChange({ ...formData, currentData: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta a ser batida
            </label>
            <p className="text-xs text-gray-400 mb-2">Informe o resultado que deseja alcançar</p>
            <input
              type="text"
              className={inputBase}
              placeholder="Ex: 65% de ativação"
              value={formData.targetData}
              onChange={(e) => onChange({ ...formData, targetData: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!hasAtLeastOne || loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Gerando OKR...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Gerar OKR
            </>
          )}
        </button>
      </div>
    </section>
  );
}
