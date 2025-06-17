# Roadmap Checklist – Préparation Production Next.js

## 1. Initialisation & Nettoyage
- [ ] Supprimer fichiers/dossiers inutiles
- [ ] Réorganiser les dossiers (`components/`, `hooks/`, `assets/`, etc.)
- [ ] Ajouter un README clair
- [ ] Créer un dossier `assets/` pour les images

## 2. Qualité & Standards
- [ ] Installer/configurer ESLint
- [ ] Installer/configurer Prettier
- [ ] Ajouter Husky pour hooks git
- [ ] Ajouter commitlint pour conventions de commit
- [ ] Ajouter scripts lint/format dans `package.json` ou `justfile`

## 3. Tests & Robustesse
- [ ] Installer Vitest + React Testing Library
- [ ] Ajouter scripts de test et coverage
- [ ] Créer un dossier `tests/` et ajouter des exemples
- [ ] Ajouter un exemple de test sur un composant

## 4. Performance & Optimisation
- [ ] Mettre en place le lazy loading des routes/pages
- [ ] Installer un analyseur de bundle
- [ ] Optimiser les images/assets
- [ ] Vérifier l'utilisation de `next/image`

## 5. Accessibilité & SEO
- [ ] Audit Lighthouse (a11y, SEO, perf)
- [ ] Checklist a11y (labels, contrastes, navigation clavier)
- [ ] Ajouter metatags essentiels (title, description, og, twitter)
- [ ] Vérifier balises structurantes (h1, nav, main, footer)

## 6. Déploiement & CI/CD
- [ ] Ajouter un pipeline GitHub Actions (ou autre)
- [ ] Générer automatiquement le build et lancer les tests
- [ ] Préparer la config pour Vercel/Netlify/autre
- [ ] Ajouter badge de build dans le README

## 7. Automatisation des tâches
- [ ] Générer un `justfile` ou `Taskfile.yml` structuré
- [ ] Ajouter les commandes : `just dev`, `just test`, `just lint`, `just format`, `just deploy` 