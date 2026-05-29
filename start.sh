#!/bin/bash
# Script de lancement pour Debian/Linux

echo "Démarrage de KBB App..."

# Vérifier si node est installé
if ! command -v node &> /dev/null
then
    echo "Node.js n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null
then
    echo "npm n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

echo "Installation des dépendances..."
npm install

echo "Lancement de l'environnement de développement..."
npm run dev
