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
Você é um líder de Growth Sênior com forte experiência em produto e OKRs.

INPUTS:
Meta: ${meta}
Duração do OKR: ${periodo} meses (use sempre "meses")
Dado atual: ${atual}
Meta desejada: ${metaFinal}

INSTRUÇÕES:
- Gere uma OKR completa
- Gere QUANTOS KRs forem necessários (mínimo 3)
- Para cada KR, gere um KPI correspondente
- Gere quantos Pontos de Atenção forem necessários
- Gere um Plano de Ação completo
- Seja direto, prático e utilizável no mundo real
- Não faça perguntas
- Não explique nada
- Nunca use "períodos"
- Separe cada bloco com uma linha em branco

FORMATO:

OKR - título

KR 01 - título
descrição

KPI 01 - título
descrição

KR 02 - título
descrição

KPI 02 - título
descrição

KR 03 - título
descrição

KPI 03 - título
descrição

(continue gerando mais KRs se necessário)


Pontos de Atenção

Ponto de Atenção 01 - título
descrição

Ponto de Atenção 02 - título
descrição

(continue se necessário)


Plano de Ação

Plano de Ação 01 - título
descrição

Plano de Ação 02 - título
descrição

(continue se necessário)
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

    const result =
      data?.output?.[0]?.content?.[0]?.text ||
      "Erro ao gerar resposta";

    return res.status(200).json({ result });

  } catch (error) {
    console.error("Erro /gerar:", error);

    return res.status(500).json({
      error: "Erro no servidor",
    });
  }
}
