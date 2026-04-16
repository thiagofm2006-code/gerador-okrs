export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { meta, periodo, atual, metaFinal } = req.body;

    const prompt = `
Você é um líder de Growth Sênior com forte experiência em produto e OKRs.

INPUTS:
Meta: ${meta}
Duração do OKR: ${periodo} meses (NUNCA use outra palavra ou unidade além de "meses")
Dado atual: ${atual}
Meta desejada: ${metaFinal}

INSTRUÇÕES:
- Gere uma OKR completa
- Inclua KRs, KPIs e Pontos de Atenção
- Inclua um plano de ação para o usuário atingir o valor desejado após o meses selecioandos
- Seja direto, prático e utilizável no mundo real
- NÃO explique nada
- NÃO faça perguntas
- Sempre use "meses" como unidade de tempo
- Nunca use "períodos", "ciclos" ou qualquer outra variação
- Dentro de cada KR, após a descriçao, ja pode inserir o KPI a ser medido pra validar aquela KR.
- pode ter quantos KR, KPI e Pontos de Atenção forem necessários
- No formato de saida eu coloquei apenas um KR e um KPI, KR 0x e KPI 0x, mas pode ter vários, o X é pra indicar o numero daquele topico
- (espaço) é pra dar uma pulada de linha antes da proxima resposta

FORMATO:

OKR - (título estratégico em negrito)

KR 0x - (resultado-chave)
(descrição)

KPI 0x - (indicador de sucesso)
(descrição)

(pular uma linha para proxima resposta)


Pontos de Atenção (titulo em negrito)
Pontos de Atenção 0x - (risco ou alerta em italico o titulo)
(descrição)

(pular uma linha para proxima resposta)

Plano de Ação (titulo em negrito)
Plano de Ação 0x (em itálico, apenas o título)
(descrição)
(pular uma linha para proxima resposta)
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

    const data = await response.json();

    const text =
      data?.output?.[0]?.content?.[0]?.text ||
      "Erro ao gerar resposta";

    return res.status(200).json({ result: text });

  } catch (error) {
    console.error("Erro /gerar:", error);

    return res.status(500).json({
      error: "Erro no servidor",
    });
  }
}
