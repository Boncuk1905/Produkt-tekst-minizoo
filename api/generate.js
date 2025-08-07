const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  console.log("▶️ API kald modtaget");

  if (req.method !== "POST") {
    console.log("⛔ Forkert HTTP-metode:", req.method);
    return res.status(405).json({ error: "Kun POST tilladt" });
  }

  if (!OPENAI_API_KEY) {
    console.error("❌ API-nøgle mangler!");
    return res.status(500).json({ error: "API-nøgle mangler" });
  } else {
    console.log("✅ API-nøgle fundet");
  }

  const { rules, links, product } = req.body;

  if (!rules || !links || !product) {
    console.log("⚠️ Manglende felter:", req.body);
    return res.status(400).json({ error: "rules, links og product skal medsendes" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: rules },
          { role: "user", content: `${links}\n\n${product}` },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI fejl:", data);
      return res.status(500).json({ error: data.error?.message || "OpenAI fejl" });
    }

    console.log("✅ Svar modtaget fra OpenAI");
    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error("💥 Serverfejl:", err);
    return res.status(500).json({ error: "Intern serverfejl" });
  }
}
