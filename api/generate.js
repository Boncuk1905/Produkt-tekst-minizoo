
export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const { texts, extraNote } = await req.json();

  const prompt = `
Du er ekspert i produkttekster til webshop.
Følg disse regler:
${texts.rules}

Brug disse links/data (brug hvert link max én gang, fordel dem jævnt):
${texts.links}

Ekstra bemærkninger: ${extraNote || "Ingen."}

Lav en produkttekst udfra ovenstående.
`.trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Du er ekspert i produktbeskrivelser." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
