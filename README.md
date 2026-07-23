# ⚡ RealityPrompt Engine

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/IA-Google_Gemini-8E75B2?logo=googlegemini&logoColor=white)
![Vercel](https://img.shields.io/badge/Serverless-Vercel-000000?logo=vercel&logoColor=white)

## 📖 Description

Générateur de **prompts éditoriaux** ancrés dans les réalités du digital : on configure (plateforme, langue, public, longueur, thème, ton, intensité…) et l'outil construit un **prompt final** rigoureux, puis **génère réellement un post** grâce à l'IA.

Le projet a été **migré d'un fichier HTML/CSS/JS statique vers une application React** (Vite), en conservant le rendu à l'identique, **et enrichi d'une vraie intégration IA** : la génération du post, autrefois simulée en dur, passe désormais par l'**API Google Gemini** via une **fonction serverless** (la clé reste côté serveur). Une simulation locale sert de secours si aucune clé n'est configurée.

## 🔗 Démo

- **Site en ligne :** https://reality-prompt-engine.vercel.app

## 🗂️ Structure

```
reality-react/
├── api/
│   └── generate.js       # fonction serverless -> appel Google Gemini (clé côté serveur)
├── src/
│   ├── App.jsx           # UI + formulaire + construction du prompt + appel IA
│   ├── index.css         # design d'origine (light/dark)
│   └── main.jsx
└── index.html
```

## 🛠️ Technologies

- **React 18** + **Vite**
- **Vercel Serverless Functions** (proxy IA sécurisé)
- **Google Gemini API** (génération de texte)
- CSS personnalisé + mode sombre

## ✨ Fonctionnalités

- 🧠 Construction d'un prompt éditorial structuré à partir de 8 paramètres
- 🤖 Génération réelle du post par IA (Google Gemini) — secours simulation si pas de clé
- 🌗 Mode clair / sombre
- 📋 Copie du prompt et du post en un clic
- ⚡ 100 % responsive

## ⚙️ Configuration

La génération IA nécessite une clé Gemini (gratuite, [Google AI Studio](https://aistudio.google.com/app/apikey)) définie dans les variables d'environnement Vercel :

```
GEMINI_API_KEY=votre_clé
GEMINI_MODEL=gemini-2.0-flash   # optionnel
```

Sans clé, l'app reste fonctionnelle et affiche un exemple de démonstration.

## 👤 Auteur

**Josué Hounkanrin** — JOJO.DEV's
Développeur Full-Stack · Cotonou, Bénin
🔗 [Portfolio](https://jojo-devs.vercel.app) · [GitHub](https://github.com/JOJODEVS-GIT)
