{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export default async function handler(req, res) \{\
  if (req.method !== "POST") \{\
    return res.status(405).json(\{ error: "M\'e9todo n\'e3o permitido" \});\
  \}\
\
  try \{\
    const \{ meta, periodo, atual, metaFinal \} = req.body;\
\
    const prompt = `\
Voc\'ea \'e9 um l\'edder de Growth S\'eanior com forte experi\'eancia em produto.\
\
INPUTS:\
Meta: $\{meta\}\
Per\'edodo: $\{periodo\} meses\
Dado atual: $\{atual\}\
Meta desejada: $\{metaFinal\}\
\
Gere OKR + KRs + KPIs + Pontos de Aten\'e7\'e3o.\
`;\
\
    const response = await fetch("https://api.openai.com/v1/responses", \{\
      method: "POST",\
      headers: \{\
        Authorization: `Bearer $\{process.env.OPENAI_API_KEY\}`,\
        "Content-Type": "application/json",\
      \},\
      body: JSON.stringify(\{\
        model: "gpt-4.1-mini",\
        input: prompt,\
      \}),\
    \});\
\
    const data = await response.json();\
\
    const text =\
      data?.output?.[0]?.content?.[0]?.text || "Erro ao gerar resposta";\
\
    return res.status(200).json(\{ result: text \});\
\
  \} catch (error) \{\
    return res.status(500).json(\{ error: "Erro no servidor" \});\
  \}\
\}}