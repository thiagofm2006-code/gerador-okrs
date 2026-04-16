export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { meta, periodo, atual, metaFinal } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY não configurada",
      });
    }

    const prompt = `
Você é um líder de Growth Sênior especialista em produto e OKRs.

Sua missão é gerar uma OKR altamente prática, estratégica e aplicável no mundo real.

DADOS DE ENTRADA:
Meta: ${meta}
Duração: ${periodo} meses
Situação atual: ${atual}
Meta desejada: ${metaFinal}

REGRAS:
- Sempre use "meses" como unidade de tempo
- Nunca use "períodos", "ciclos" ou variações
- Gere no mínimo 3 KRs (pode gerar mais se fizer sentido)
- Cada KR deve ter um KPI correspondente
- Seja específico, evite genérico
- Foque em impacto real de produto/growth
- Não faça perguntas
- Não explique nada fora do formato

FORMATAÇÃO (OBRIGATÓRIA):
- Sempre separar blocos com linha em branco
- Nunca juntar KR com KPI na mesma linha
- Nunca colar seções

FORMATO DE SAÍDA:

OKR - [título claro e estratégico]

KR 01 - [resultado-chave]
[descrição clara e objetiva]

KPI 01 - [indicador]
[descrição do que será medido]

KR 02 - [resultado-chave]
[descrição]

KPI 02 - [indicador]
[descrição]

KR 03 - [resultado-chave]
[descrição]

KPI 03 - [indicador]
[descrição]

(adicione mais KRs se necessário)


Pontos de Atenção

Ponto de Atenção 01 - [risco]
[descrição]

Ponto de Atenção 02 - [risco]
[descrição]

(adicione mais se necessário)


Plano de Ação

Plano de Ação 01 - [ação]
[descrição]

Plano de Ação 02 - [ação]
[descrição]

Plano de Ação 03 - [ação]
[descrição]

(adicione mais se necessário)
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const textResponse = await response.text();

    if (!response.ok) {
      console.error("Erro OpenAI:", textResponse);
      return res.status(500).json({
        error: "Erro na OpenAI",
      });
    }

    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error("Resposta inválida:", textResponse);
      return res.status(500).json({
        error: "Resposta inválida da OpenAI",
      });
    }

    let result =
      data?.output?.[0]?.content?.[0]?.text ||
      "Erro ao gerar resposta";

    // 🔥 NORMALIZAÇÃO PROFISSIONAL (resolve seu problema de espaçamento)
    result = result
      .replace(/\r/g, '')           // remove \r
      .replace(/\n{3,}/g, '\n\n')  // evita excesso de quebra
      .trim();

    return res.status(200).json({ result });

  } catch (error) {
    console.error("Erro /gerar:", error);

    return res.status(500).json({
      error: "Erro no servidor",
    });
  }
}
