export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST tilladt" });
  }

  const { rules, links, product } = req.body;

  if (!rules || !links || !product) {
    return res.status(400).json({ error: "Manglende felter" });
  }

  // Midlertidigt dummy-output:
  return res.status(200).json({
    result: `Regler: ${rules.length} tegn, Links: ${links.length} tegn, Produkt: ${product.length} tegn`
  });
}
