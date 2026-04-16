import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

const items: AccordionItem[] = [
  {
    title: 'O que é OKR?',
    content: (
      <p className="text-gray-600 leading-relaxed">
        OKR (Objectives and Key Results) é um framework de gestão que conecta objetivos estratégicos a resultados mensuráveis. Ele orienta times a focarem no que realmente gera impacto no negócio. É amplamente utilizado para alinhar execução com estratégia.
      </p>
    ),
  },
  {
    title: 'O que é KR e KPI?',
    content: (
      <p className="text-gray-600 leading-relaxed">
        KR (Key Result) define resultados mensuráveis que indicam o sucesso de um objetivo. KPI é um indicador contínuo que monitora a performance ao longo do tempo. Enquanto o KR mede o atingimento, o KPI apoia a tomada de decisão durante o caminho.
      </p>
    ),
  },
  {
    title: 'Por que o Product Owner deve dominar isso?',
    content: (
      <p className="text-gray-600 leading-relaxed">
        Dominar OKRs permite ao Product Owner priorizar iniciativas com base em impacto real. Facilita o alinhamento entre produto, negócio e stakeholders. Além disso, melhora a qualidade das decisões e reduz retrabalho no desenvolvimento.
      </p>
    ),
  },
  {
    title: 'Exemplo prático',
    content: (
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Objetivo:</span>{' '}
            <span className="text-gray-600">Aumentar a ativação de novos usuários</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">KR:</span>{' '}
            <span className="text-gray-600">Elevar a taxa de ativação de 40% para 65%</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">KPI:</span>{' '}
            <span className="text-gray-600">Taxa de conversão por etapa do onboarding</span>
          </div>
        </div>
      </div>
    ),
  },
];

function AccordionItemComponent({ item, isOpen, onToggle }: { item: AccordionItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="font-medium text-gray-800 text-sm">{item.title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ml-3 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-5 pb-4 bg-white border-t border-gray-100">
          <div className="pt-3">{item.content}</div>
        </div>
      </div>
    </div>
  );
}

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Conceitos</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <AccordionItemComponent
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}
