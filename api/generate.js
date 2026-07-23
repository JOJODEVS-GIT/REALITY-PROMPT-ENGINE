// Fonction serverless Vercel — génère le post via l'API Google Gemini.
// La clé reste côté serveur (variable d'environnement GEMINI_API_KEY).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Pas de clé configurée -> le front bascule sur la simulation locale
    return res.status(200).json({ error: "Clé IA non configurée (GEMINI_API_KEY)." });
  }

  const prompt = req.body?.prompt;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt manquant.' });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
      }),
    });
    const data = await r.json();

    if (!r.ok) {
      return res.status(502).json({ error: data?.error?.message || 'Erreur API Gemini.' });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'Réponse IA vide.' });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de contacter l’IA.' });
  }
}
