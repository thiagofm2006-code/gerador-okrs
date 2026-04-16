import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { meta, periodo, atual, metaFinal } = req.body;

    const prompt = `
Você é um líder de growth sênior especialista em OKRs.

Com base nas informações abaixo, gere uma OKR completa, prática e utilizável no mundo real.

Meta: ${meta}
Período: ${periodo} meses
Dado atual: ${atual}
Meta desejada: ${metaFinal}

Regras:
- Gere um título estratégico para a OKR
- Gere múltiplos KR (sem limite)
- Gere múltiplos KPI (sem limite)
- Gere múltiplos Pontos de Atenção (sem limite)
- Seja direto, claro e profissional
- NÃO faça perguntas
- NÃO converse com o usuário

Formato obrigatório:

OKR - (título)

KR 01 - (título)
(descrição)

KR 02 - (título)
(descrição)

KPI 01 - (título)
(descrição)

KPI 02 - (título)
(descrição)

Pontos de Atenção 01 - (título)
(descrição)

Pontos de Atenção 02 - (título)
(descrição)
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const result =
      data.choices?.[0]?.message?.content || 'Erro ao gerar resposta';

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
