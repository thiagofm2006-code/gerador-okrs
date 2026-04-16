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
Você é um especialista em OKRs.

Meta: ${meta}
Período: ${periodo}
Atual: ${atual}
Meta final: ${metaFinal}

Crie uma OKR completa com KRs, KPIs e riscos.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
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

    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
