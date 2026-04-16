import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { goal, period, currentData, targetData } = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "API key de IA não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parts: string[] = [];
    if (goal) parts.push(`Meta/Objetivo: ${goal}`);
    if (period) parts.push(`Período: ${period} ${Number(period) === 1 ? 'mês' : 'meses'}`);
    if (currentData) parts.push(`Situação atual: ${currentData}`);
    if (targetData) parts.push(`Meta a alcançar: ${targetData}`);

    const userContext = parts.join('\n');

    const prompt = `Você é um especialista em Product Management e frameworks de OKR. Com base nas informações fornecidas, crie um OKR completo e estratégico.

Informações fornecidas:
${userContext}

Gere um OKR estruturado no seguinte formato:

## Objetivo
[Escreva um objetivo claro, inspirador e orientado a impacto]

## Key Results (KRs)
- **KR1:** [Resultado mensurável 1 com métricas claras]
- **KR2:** [Resultado mensurável 2 com métricas claras]
- **KR3:** [Resultado mensurável 3 com métricas claras]

## KPIs de Acompanhamento
- **KPI1:** [Indicador contínuo de performance 1]
- **KPI2:** [Indicador contínuo de performance 2]

## Iniciativas Sugeridas
- [Ação estratégica 1 para atingir os KRs]
- [Ação estratégica 2 para atingir os KRs]
- [Ação estratégica 3 para atingir os KRs]

## Dicas do Especialista
[2-3 dicas práticas e específicas para esse OKR ser bem-sucedido]

Seja específico, use os dados fornecidos para tornar o OKR relevante e acionável. Escreva em português brasileiro.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um especialista em OKRs e Product Management. Sempre responde em português brasileiro de forma clara e estruturada." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errText}`);
    }

    const json = await response.json();
    const result = json.choices?.[0]?.message?.content;

    if (!result) throw new Error("Resposta vazia da IA.");

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
