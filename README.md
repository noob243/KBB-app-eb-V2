# KBB App — Application de Gestion de Cabinet d'Avocats

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> Application web moderne pour la gestion complète d'un cabinet d'avocats : clients, dossiers, audiences, facturation et documents.

---

## ✨ Fonctionnalités

| Module | Description |
|---|---|
| 📊 **Tableau de bord** | Vue d'ensemble : dossiers actifs, clients, événements à venir |
| 👥 **Clients** | Ajout, consultation et gestion de la base de données clients |
| 📁 **Dossiers** | Création, suivi des statuts, tâches et pièces jointes |
| 📅 **Événements** | Audiences, conférences, colloques et dates importantes |
| ✅ **Agenda & Tâches** | Suivi des tâches avec échéances et assignations |
| 💬 **Messagerie** | Chat interne entre membres du cabinet |
| 🧾 **Facturation** | Factures, montants restants, statuts de paiement |
| ⚖️ **Avocats** | Répertoire avec informations professionnelles et de contact |
| 🛠️ **Administration** | Gestion centralisée de toutes les données |
| 📄 **Export PDF** | Génération de rapports pour clients et dossiers |
| 🔐 **Authentification** | Interface de connexion sécurisée |
| 💾 **Persistance** | Données sauvegardées localement via `localStorage` |

---

## 🛠️ Stack Technique

- **[React 19](https://react.dev/)** — Interface utilisateur
- **[TypeScript 5.8](https://www.typescriptlang.org/)** — Typage statique
- **[Vite 6](https://vitejs.dev/)** — Build tool et serveur de développement
- **[Recharts](https://recharts.org/)** — Graphiques et visualisations
- **[Google Gemini AI](https://ai.google.dev/)** — Fonctionnalités d'intelligence artificielle

---

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) v9 ou supérieur

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/noob243/KBB-app-eb-V2.git
cd KBB-app-eb-V2

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env et renseignez votre clé API Gemini
```

### Lancement

```bash
# Mode développement (avec hot-reload)
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile le projet pour la production |
| `npm run preview` | Prévisualise le build de production |

---

## ⚙️ Configuration

Copiez `.env.example` en `.env` et renseignez vos valeurs :

```env
# Clé API Google Gemini (pour les fonctionnalités IA)
GEMINI_API_KEY=your_gemini_api_key_here
```

> 🔑 Obtenez votre clé API sur [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 📁 Structure du Projet

```
kbb-app-v2/
├── src/
│   ├── components/       # Composants réutilisables (Header, Sidebar, StatCard…)
│   ├── pages/            # Pages de l'application (Dashboard, Clients, Dossiers…)
│   ├── hooks/            # Custom React hooks
│   ├── data/             # Données initiales et mock data
│   ├── types/            # Définitions TypeScript
│   └── App.tsx           # Composant racine et routing
├── index.html            # Point d'entrée HTML
├── vite.config.ts        # Configuration Vite
├── tsconfig.json         # Configuration TypeScript
├── start.sh              # Script de lancement (Linux/macOS)
├── start.bat             # Script de lancement (Windows)
└── .env.example          # Modèle de configuration
```

---

## 🖥️ Lancement rapide (scripts)

**Linux / macOS :**
```bash
chmod +x start.sh
./start.sh
```

**Windows :**
```bat
start.bat
```

---

## 📝 Licence

Ce projet est sous licence [MIT](./LICENSE).

---

<p align="center">
  Développé avec ❤️ pour la gestion moderne des cabinets d'avocats
</p>
