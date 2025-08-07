export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  try {
    const { prompts = [], data = [] } = req.body;

    const promptText = prompts.map(p => p.content).join('\n\n');
    const dataText = data.map(d => d.content).join('\n\n');

    const finalText = `📝 GENERERET PRODUKTTEKST\n--------------------------\nRegler:\n${promptText}\n\nData / Links:\n${dataText}`;

    return res.status(200).json({ text: finalText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
