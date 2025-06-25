# Xdose – Roadmap de Production

Ce document détaille les tâches restantes pour passer l'application en production, organisées par phases critiques.

---

## 🚀 Phase 1 : Fonctionnalités de base (Bloquant pour le Go-Live)

*L'objectif de cette phase est d'avoir une application fonctionnelle avec des données réelles.*

### Tâche 1.1 : Remplacer toutes les données mock par des requêtes API réelles
- **Contexte** : Actuellement, les pages `Feed`, `Profile` et `Discover` utilisent des données de test (mocks). Il faut les connecter à la base de données.
- [x] **Créer une route API `GET /api/videos`** : Elle doit récupérer les dernières vidéos de la base de données (avec les infos du créateur) pour les pages `Feed` et `Discover`.
- [ ] **Créer une route API `GET /api/users/[id]`** : Elle doit récupérer les informations d'un profil utilisateur et la liste de ses vidéos.
- [x] **Refactoriser `FeedPage`** : Remplacer `mockPosts` par un appel à la nouvelle route API `/api/videos`.
- [ ] **Refactoriser `ProfilePage`** : Remplacer `profileData` et `userVideos` par un appel à la nouvelle route API `/api/users/[id]`.
- [x] **Refactoriser `DiscoverPage`** : Remplacer `trendingVideos` par un appel à la nouvelle route API `/api/videos`.

### Tâche 1.2 : Rendre le flow d'upload vidéo robuste et clair pour l'utilisateur
- **Contexte** : Le flow d'upload fonctionne, mais l'UX (feedback utilisateur) est minimale.
- **Actions** :
    - [ ] **Gestion du succès d'upload** : Après le PUT vers Mux, afficher un message clair comme "Upload réussi, votre vidéo est en cours de traitement".
    - [ ] **Redirection ou mise à jour de l'UI** : Après un upload réussi, rediriger vers la page du studio ou mettre à jour la liste des vidéos pour que l'utilisateur voie sa nouvelle vidéo (même en statut `pending`).
    - [ ] **Feedback d'erreur détaillé** : Capturer et afficher les erreurs venant de l'API `/api/videos/upload` et de l'upload direct vers Mux.
    - [ ] **État de chargement du player** : Le `VideoPlayer` doit afficher un spinner ou un skeleton pendant que Shaka Player charge la vidéo.

### Tâche 1.3 : Configuration de l'environnement de production
- **Contexte** : Les variables d'environnement sont critiques et doivent être parfaitement gérées.
- **Actions** :
    - [ ] **Créer un fichier `.env.example`** : Lister toutes les variables nécessaires (`DATABASE_URL`, `MUX_...`, `NEXTAUTH_...`) pour faciliter le setup pour d'autres développeurs et la CI.
    - [ ] **Vérifier toutes les variables sur Vercel** : S'assurer que les secrets et les ID sont corrects et ne sont pas des valeurs de test.

---

## 🛡️ Phase 2 : Stabilisation & Sécurité (Hautement recommandé avant le Go-Live)

*L'objectif est de rendre l'application fiable, sécurisée et testable.*

### Tâche 2.1 : Audit de sécurité et renforcement des droits
- **Contexte** : Les routes sont protégées, mais une vérification exhaustive est nécessaire.
- **Actions** :
    - [ ] **Vérifier toutes les routes API** : S'assurer que chaque route sensible vérifie bien le rôle et l'identité de l'utilisateur (ex: un utilisateur ne doit pas pouvoir modifier une vidéo qui ne lui appartient pas).
    - [ ] **Sécuriser les webhooks** : Le secret du webhook Mux est en place, c'est bon. Vérifier qu'aucun autre webhook n'est exposé sans sécurité.

### Tâche 2.2 : Mettre en place une stratégie de tests
- **Contexte** : Il n'y a actuellement aucun test automatisé.
- **Actions** :
    - [ ] **Installer et configurer un framework de test** (ex: Vitest ou Jest avec React Testing Library).
    - [ ] **Écrire des tests unitaires** pour les fonctions critiques (ex: la vérification de signature Mux).
    - [ ] **Écrire des tests d'intégration** pour le flow d'upload complet.

### Tâche 2.3 : Déploiement continu et migrations (CI/CD)
- **Contexte** : Les migrations de base de données sont encore manuelles.
- **Actions** :
    - [ ] **Automatiser les migrations Prisma** : Ajouter la commande `prisma migrate deploy` au script de build de Vercel pour que les migrations s'appliquent automatiquement lors d'un déploiement.
    - [ ] **Mettre en place un pipeline CI simple** (ex: GitHub Actions) qui lance le `lint` et les `tests` à chaque push pour garantir la qualité du code.

---

## ✨ Phase 3 : Optimisations & Finitions (Peut être fait post-Go-Live)

*L'objectif est d'améliorer l'expérience utilisateur, les performances et la maintenabilité.*

### Tâche 3.1 : Optimisation des performances
- **Actions** :
    - [ ] **Optimiser les images** : Utiliser `next/image` pour les miniatures (`poster`) et les avatars pour profiter de l'optimisation automatique.
    - [ ] **Analyser le bundle** : Utiliser `@next/bundle-analyzer` pour identifier et réduire les dépendances lourdes.
    - [ ] **Lazy loading** : Charger le `VideoPlayer` de manière dynamique uniquement quand il est visible à l'écran.

### Tâche 3.2 : SEO et Métadonnées
- **Actions** :
    - [ ] **Métadonnées dynamiques** : Mettre à jour le `<title>` et les `<meta>` (description, og:image) de manière dynamique sur les pages de profil et de vidéo.
    - [ ] **Sitemap** : Générer un `sitemap.xml` pour aider au référencement.

### Tâche 3.3 : Monitoring et gestion des erreurs
- **Actions** :
    - [ ] **Intégrer un service de monitoring** (ex: Sentry) pour capturer les erreurs en production.
    - [ ] **Créer des pages d'erreur personnalisées** (`404.tsx`, `500.tsx`).

### Tâche 3.4 : Qualité de vie et documentation
- **Actions** :
    - [ ] **Mettre à jour le `README.md`** : Expliquer le setup complet, le fonctionnement avec Mux, et les commandes utiles.
    - [ ] **Nettoyer le code** : Supprimer les `console.log` de debug, les commentaires inutiles, et les fichiers non utilisés.

---

## 🧑‍💻 Logique profils (Creator/Viewer)

- Un **creator** peut :
  - Visiter et modifier son propre profil (page `/profile`)
  - Visiter le profil public d'autres creators (page `/profile/[id]`)
- Un **viewer** peut :
  - Visiter le profil public de n'importe quel creator (page `/profile/[id]`)
  - Ne peut pas modifier de profil
- Les routes d'édition (modification profil, upload, suppression vidéo) doivent vérifier que l'utilisateur connecté est bien le propriétaire du profil.
- Le profil public (`/profile/[id]`) affiche les infos et vidéos publiques d'un creator, accessible à tous.
- Le profil privé (`/profile`) affiche le dashboard complet (édition, upload, stats), accessible uniquement au creator connecté.

---

**À faire en priorité pour passer en production :**
- Remplacer tous les mocks par des requêtes réelles (Prisma/API)
- Tester le flow complet d'upload/lecture vidéo avec de vrais utilisateurs
- Sécuriser toutes les routes et vérifier les droits
- Mettre à jour la documentation (README, .env, usage Mux)
- Mettre en place la CI et les scripts de migration Prisma sur la prod

---

*Ce fichier doit être mis à jour à chaque étape majeure avant le go-live.* 