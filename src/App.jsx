import { useRef, useState } from 'react';

const initialForm = {
  plateforme: 'LinkedIn',
  langue: 'Français',
  publicCible: 'Entrepreneurs',
  longueur: 'Court (< 150 mots)',
  contexteAfricain: false,
  theme: '',
  ton: 'Calme & lucide',
  intensite: 'douce',
};

function buildPrompt(f) {
  return `Tu es un rédacteur professionnel expérimenté, humain, crédible et lucide.
Ton style est anti-bullshit, anti-gourou, orienté réalité brute, discipline et effort sustained.
Tu ne fais jamais de promesses irréalistes, tu n'utilises aucun jargon vide, aucun cliché motivant, aucune solution miracle (même implicite).
Tu ne cites jamais de technologie ou d'outil spécifique. Tu ne parles jamais de ton expérience personnelle.

Écris un post ${f.longueur.toLowerCase()} pour ${f.plateforme}, en ${f.langue}, destiné à un public de ${f.publicCible}.

Thème unique et central : ${f.theme}.

Ton général : ${f.ton}. Intensité : ${f.intensite}.

${f.contexteAfricain ? "Intègre subtilement le contexte africain réaliste (contraintes data, informalité économique, coupures, etc.) sans en faire trop." : ""}

Structure obligatoire du post :
- Accroche forte (question, constat brutal ou paradoxe)
- Paragraphes courts
- Au milieu : exprimer un doute, une fatigue ou une micro-tension réelle
- Phrase vérité finale brutale, incontestable et mémorable
- Hashtags en fin : 5 à 8, spécifiques et peu concurrentiels (ex: #TravailInvisible #ProgressionSilencieuse #RéalitéDigitale #DisciplineQuotidienne #CoûtDeLaDiscipline)

Le post doit sonner 100% humain, profond, cash quand il faut, mais toujours factuel et sans embellissement.`;
}

// Simulation locale (secours si aucune clé IA configurée) — reprise de l'original.
function generatePostExample(f) {
  const { theme } = f;
  let accroche = '', milieu = '', fin = '';
  const hashtags = "\n\n#TravailInvisible #ProgressionSilencieuse #RéalitéDigitale #DisciplineQuotidienne #CoûtDeLaDiscipline";

  if (theme === 'Progression silencieuse') {
    accroche = "On vous vend du succès overnight.\n\nLa réalité ? 90 % du chemin se fait dans l’ombre, sans likes, sans applaudissements.";
    milieu = "\nIl y a des matins où tu ouvres ton dashboard et rien n’a bougé.\nTu te demandes si tu perds ton temps.\nPourtant tu continues.";
    fin = "\nLa progression silencieuse, c’est ça : avancer sans preuve visible.\nJusqu’au jour où les résultats parlent d’eux-mêmes.\nEt là, plus personne ne demande comment tu as fait.";
  } else if (theme === 'Coût caché de la discipline') {
    accroche = "Tout le monde parle de discipline comme si c’était gratuit.";
    milieu = "\nPersonne ne dit que pour tenir sur 3 ans, il faut parfois dire non à des sorties, à des relations, au sommeil décent.\nQue ça pèse sur le moral certains jours.";
    fin = "\nLa discipline a un prix.\nCeux qui réussissent longtemps sont juste ceux qui ont accepté de le payer.\nSans négocier.";
  } else if (theme === 'Doute & remise en question') {
    accroche = "Le doute n’est pas l’ennemi du progrès.";
    milieu = "\nIl revient tous les 6 mois : « Est-ce que je me plante complètement ? »\nTu regardes les autres qui semblent avancer plus vite.\nTu te demandes si tu devrais pivoter.";
    fin = "\nMais ceux qui tiennent ne sont pas ceux qui n’ont jamais douté.\nCe sont ceux qui ont continué malgré le doute.\nPoint.";
  }
  return accroche + milieu + fin + hashtags;
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null); // { prompt, post, source }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const toggleDark = () => {
    setDark((d) => {
      document.body.classList.toggle('dark', !d);
      return !d;
    });
  };

  const update = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.theme) return;
    const prompt = buildPrompt(form);
    setError('');
    setLoading(true);
    setResult({ prompt, post: '', source: 'loading' });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setResult({ prompt, post: data.text.trim(), source: 'ia' });
      } else {
        // Pas de clé / erreur API -> secours simulation locale
        setError(data.error || "IA indisponible — exemple de démonstration affiché.");
        setResult({ prompt, post: generatePostExample(form), source: 'simulation' });
      }
    } catch (err) {
      setError("IA indisponible — exemple de démonstration affiché.");
      setResult({ prompt, post: generatePostExample(form), source: 'simulation' });
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => alert('Copié dans le presse-papiers !'));
  };

  return (
    <>
      <button className="toggle-dark" onClick={toggleDark}>{dark ? '☀️' : '🌙'}</button>

      <header>
        <h1>RealityPrompt Engine</h1>
        <p className="subtitle">Générateur de prompts éditoriaux ancrés dans les réalités du digital</p>
      </header>

      <main>
        <form id="engineForm" onSubmit={onSubmit}>
          <div className="card">
            <h2>1. Configuration Générale</h2>
            <label>Plateforme cible</label>
            <select value={form.plateforme} onChange={update('plateforme')} required>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="X">X (Twitter)</option>
            </select>

            <label>Langue</label>
            <select value={form.langue} onChange={update('langue')} required>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
            </select>

            <label>Public cible</label>
            <select value={form.publicCible} onChange={update('publicCible')} required>
              <option value="Entrepreneurs">Entrepreneurs</option>
              <option value="Digital / Tech">Digital / Tech</option>
              <option value="Créateurs">Créateurs</option>
              <option value="Freelances">Freelances</option>
            </select>

            <label>Longueur du contenu</label>
            <select value={form.longueur} onChange={update('longueur')} required>
              <option value="Court (< 150 mots)">Court (&lt; 150 mots)</option>
              <option value="Moyen (150–300 mots)">Moyen (150–300 mots)</option>
              <option value="Long (> 300 mots)">Long (&gt; 300 mots)</option>
            </select>
          </div>

          <div className="card">
            <h2>3. Contexte &amp; Réalités</h2>
            <div className="checkbox-item">
              <input type="checkbox" id="contexteAfricain" checked={form.contexteAfricain} onChange={update('contexteAfricain')} />
              <label htmlFor="contexteAfricain">Activer le contexte africain (contraintes data, informalité, etc.)</label>
            </div>
          </div>

          <div className="card">
            <h2>4. Thème Central (un seul)</h2>
            <select value={form.theme} onChange={update('theme')} required>
              <option value="" disabled>Choisis un thème</option>
              <option value="Réalité du domaine">Réalité du domaine</option>
              <option value="Discipline & constance">Discipline &amp; constance</option>
              <option value="Doute & remise en question">Doute &amp; remise en question</option>
              <option value="Résilience">Résilience</option>
              <option value="Progression silencieuse">Progression silencieuse</option>
              <option value="Focus long terme">Focus long terme</option>
              <option value="Coût caché de la discipline">Coût caché de la discipline</option>
            </select>
          </div>

          <div className="card">
            <h2>5. Ton &amp; Style</h2>
            <label>Ton principal</label>
            <select value={form.ton} onChange={update('ton')} required>
              <option value="Calme & lucide">Calme &amp; lucide</option>
              <option value="Cash mesuré">Cash mesuré</option>
              <option value="Cash frontal">Cash frontal (factuel)</option>
            </select>

            <label>Intensité</label>
            <select value={form.intensite} onChange={update('intensite')}>
              <option value="douce">Douce</option>
              <option value="tranchante">Tranchante</option>
              <option value="percutante">Percutante</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Génération en cours…' : 'Générer le Prompt + Post exemple'}
          </button>
        </form>

        {result && (
          <div className="card" ref={resultRef}>
            <h2>Résultat</h2>

            <h3>Prompt Final (à copier pour une IA)</h3>
            <pre className="output">{result.prompt}</pre>
            <button className="copy-btn" onClick={() => copy(result.prompt)}>Copier le prompt</button>

            <h3 style={{ marginTop: '2rem' }}>Post généré par l'IA</h3>
            <pre className="output">{result.source === 'loading' ? "L'IA rédige le post…" : result.post}</pre>
            {result.source === 'ia' && <p className="ai-note">✨ Généré par IA (Google Gemini)</p>}
            {result.source === 'simulation' && <p className="ai-error">{error}</p>}
            {result.source !== 'loading' && (
              <button className="copy-btn" onClick={() => copy(result.post)}>Copier le post</button>
            )}
          </div>
        )}
      </main>

      <footer>
        RealityPrompt Engine — Une voix lucide, sans bullshit.<br />
        Philosophie : cadre de pensée rigoureux • cohérence absolue • réalité avant tout
      </footer>
    </>
  );
}
