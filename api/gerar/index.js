export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { meta, periodo, atual, metaFinal } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada na Vercel');
    }

    const prompt = `
Você é um líder de Growth e Product especialista em OKRs.

Crie uma OKR completa, prática e aplicável no mundo real.

## Contexto
Meta: ${meta}
Tempo total do OKR: ${periodo} meses
Situação atual: ${atual}
Meta desejada: ${metaFinal}

## Regras obrigatórias
- Use SEMPRE "meses" como unidade de tempo (nunca use "períodos")
- Seja direto, claro e objetivo
- Não faça perguntas
- Não explique o que está fazendo
- Gere conteúdo pronto para uso

## Estrutura obrigatória da resposta

OKR - (título estratégico)

KR 01 - (resultado-chave)
(descrição objetiva)

KR 02 - (resultado-chave)
(descrição objetiva)

KR 03 - (resultado-chave)
(descrição objetiva)

KPI 01 - (indicador)
(descrição)

KPI 02 - (indicador)
(descrição)

Pontos de Atenção 01 - (risco ou alerta)
(descrição)

Pontos de Atenção 02 - (risco ou alerta)
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

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || 'Erro na OpenAI',
      });
    }

    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(500).json({
        error: 'Resposta vazia da OpenAI',
      });
    }

    return res.status(200).json({ result });

  } catch (error) {
    console.error('ERRO /gerar:', error);

    return res.status(500).json({
      error: error.message || 'Erro interno no servidor',
    });
  }
}
