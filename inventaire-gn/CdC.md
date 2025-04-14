Cahier des Charges Technique - Application d'Inventaire GN
==========================================================

1\. Présentation du projet
--------------------------

### 1.1 Contexte

L'application "Inventaire GN" vise à faciliter la gestion d'inventaire pour les événements de Grandeur Nature (GN), en permettant un suivi structuré du matériel nécessaire. L'application est spécifiquement conçue pour prendre en compte les besoins des personnes avec TDAH/ADHD, en offrant une interface intuitive qui réduit la charge cognitive.

### 1.2 Objectifs

*   Faciliter le suivi d'inventaire d'équipement pour les événements GN
*   Permettre la vérification méthodique d'éléments par sections
*   Offrir une visualisation claire de l'avancement
*   Fournir des fonctionnalités d'import/export pour la persistance des données
*   Permettre un filtrage par statut pour organiser les tâches à effectuer
*   S'adapter aux écrans mobiles pour une utilisation sur le terrain

2\. Technologies requises
-------------------------

### 2.1 Framework et bibliothèques

*   Vue.js (Vue 3)
*   Tailwind CSS pour une approche mobile-first
*   Vite comme outil de build

### 2.2 Hébergement et déploiement

*   Application statique pouvant être déployée sur n'importe quel hébergeur (GitHub Pages, Netlify, etc.)
*   Utilisation du localStorage pour la persistance des données côté client

3\. Architecture technique
--------------------------

### 3.1 Structure des fichiers

    /
    ├── public/
    │   └── favicon.ico
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── inventory/
    │   │   │   ├── FilteredView.vue
    │   │   │   ├── InventoryManager.vue
    │   │   │   ├── InventorySections.vue
    │   │   │   ├── ProgressSection.vue
    │   │   │   └── StatusFilter.vue
    │   │   └── ui/
    │   │       ├── CelebrationModal.vue
    │   │       ├── NoteModal.vue
    │   │       ├── ThemeToggle.vue
    │   │       └── Toast.vue
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js

### 3.2 Modèle de données

L'inventaire est structuré comme suit:

json

    {
      "section_key": {
        "title": "Titre de la section",
        "subsections": {
          "subsection_key": {
            "title": "Titre de la sous-section",
            "items": [
              {
                "name": "Nom de l'élément",
                "isBox": true/false,
                "status": "present"/"to-find"/"to-repair"/"to-buy"/"not-needed"/"in-truck"/null,
                "inTruck": true/false,
                "note": "Note éventuelle",
                "currentQuantity": null/nombre,
                "targetQuantity": nombre (optionnel),
                "isMinimumQuantity": true/false (optionnel),
                "variableQuantity": true/false (optionnel)
              }
            ]
          }
        }
      }
    }

### 3.3 États de l'application

*   `inventory`: Objet contenant toutes les données d'inventaire
*   `isLoading`: État de chargement des données
*   `openSections`: Liste des sections ouvertes actuellement
*   `activeStatusDropdown`: Position du dropdown de statut actif
*   `noteModalActive`: État d'affichage de la modal de notes
*   `currentNote`: Contenu de la note en cours d'édition
*   `currentItem`: Référence à l'élément actuellement sélectionné
*   `celebrationActive`: État d'affichage de la modal de célébration
*   `toastActive`: État d'affichage des notifications toast
*   `toastMessage`: Message de la notification toast
*   `currentFilter`: Filtre de statut actif ("all", "present", "to-find", etc.)
*   `currentFilteredItem`: Élément sélectionné dans la vue filtrée

4\. Fonctionnalités détaillées
------------------------------

### 4.1 Gestion de l'inventaire

#### 4.1.1 Structure hiérarchique

*   Organisation en sections
*   Chaque section contient des sous-sections
*   Chaque sous-section contient des éléments

#### 4.1.2 Types d'éléments

*   Éléments standard: statut simple
*   Éléments avec quantité fixe: nombre précis à vérifier
*   Éléments avec quantité variable: nombre à entrer
*   Éléments "box": représentant des conteneurs (caisses, malles)

#### 4.1.3 Statuts des éléments

*   "À vérifier" (null): État initial
*   "Présent": Élément trouvé et disponible
*   "À trouver": Élément manquant à localiser
*   "À réparer": Élément présent mais nécessitant réparation
*   "À acheter": Élément à acquérir
*   "Pas besoin": Élément non nécessaire pour l'événement
*   "Dans le camion": Élément présent et chargé

### 4.2 Interface utilisateur

#### 4.2.1 Vue principale

*   Barre de progression globale en haut
*   Compteurs des éléments par statut sous la barre
*   Liste des sections dépliables/repliables
*   Dans chaque section: liste des éléments avec statut et actions

#### 4.2.2 Interface par élément

*   Nom de l'élément (avec indicateur pour les "box")
*   Champ de quantité (si applicable)
*   Bouton "OK" pour marquer rapidement comme présent
*   Menu déroulant pour choisir d'autres statuts
*   Icône pour ajouter/modifier une note

#### 4.2.3 Filtres par statut

*   Onglets permettant de filtrer les éléments par statut
*   Vue dédiée montrant tous les éléments d'un statut donné
*   Possibilité de modifier le statut depuis cette vue

#### 4.2.4 Modales et notifications

*   Modal pour l'édition de notes
*   Modal de célébration à la complétion d'une section
*   Notifications toast pour confirmer les actions

#### 4.2.5 Thème clair/sombre

*   Possibilité de basculer entre thème clair et sombre
*   Respect des préférences système
*   Sauvegarde de la préférence dans le localStorage

#### 4.2.6 Adaptations ADHD/TDAH

*   Interface structurée par sections focalisables
*   Feedback visuel immédiat après les actions
*   Célébrations/récompenses visuelles
*   Codes couleur distincts pour les différents statuts
*   Possibilité de se concentrer sur une catégorie d'actions (via filtres)

### 4.3 Gestion des données

#### 4.3.1 Persistance locale

*   Sauvegarde automatique dans le localStorage
*   Chargement automatique au démarrage

#### 4.3.2 Import/Export

*   Export des données au format JSON
*   Import de données depuis un fichier JSON
*   Compatibilité entre différentes versions

5\. Spécifications des composants
---------------------------------

### 5.1 InventoryManager.vue

*   **Rôle**: Composant principal orchestrant les autres composants
*   **Props**: Aucune
*   **État**: Toutes les données d'inventaire et états de l'application
*   **Méthodes**:
    *   Chargement/sauvegarde des données
    *   Calcul des métriques (progression, compteurs)
    *   Gestion des filtres et modales
    *   Import/export des données

### 5.2 ProgressSection.vue

*   **Rôle**: Affiche la progression globale et les compteurs
*   **Props**:
    *   `overallProgress`: Pourcentage de progression
    *   `toFindCount`: Nombre d'éléments à trouver
    *   `toBuyCount`: Nombre d'éléments à acheter
    *   `toRepairCount`: Nombre d'éléments à réparer

### 5.3 StatusFilter.vue

*   **Rôle**: Onglets de filtrage par statut
*   **Props**:
    *   `currentFilter`: Filtre actif
    *   `toFindCount`, `toBuyCount`, `toRepairCount`: Compteurs
*   **Événements**:
    *   `change-filter`: Émis lors de la sélection d'un filtre

### 5.4 InventorySections.vue

*   **Rôle**: Affiche l'arborescence complète de l'inventaire
*   **Props**:
    *   `inventory`: Données d'inventaire
    *   `openSections`: Sections actuellement ouvertes
    *   `activeStatusDropdown`: État du dropdown de statut
    *   `getStatusLabel`, `getStatusClass`: Fonctions d'accès aux statuts
*   **Événements**:
    *   `toggle-section`: Ouvrir/fermer une section
    *   `toggle-status`: Ouvrir/fermer le menu de statut
    *   `update-status`: Changer le statut d'un élément
    *   `mark-present`: Marquer un élément comme présent
    *   `open-note`: Ouvrir la modal de note
    *   `save`: Sauvegarder les modifications (quantités)

### 5.5 FilteredView.vue

*   **Rôle**: Affiche les éléments filtrés par statut
*   **Props**:
    *   `filteredItems`: Éléments filtrés
    *   `currentFilter`: Filtre actif
    *   `getStatusLabel`: Fonction d'accès aux libellés de statut
*   **Événements**:
    *   `mark-item`: Marquer un élément avec un statut
    *   `change-status`: Ouvrir la sélection de statut
    *   `reset-filter`: Revenir à la vue complète

### 5.6 Composants UI

*   **NoteModal.vue**: Modal d'édition de notes
*   **CelebrationModal.vue**: Modal de célébration
*   **Toast.vue**: Notifications temporaires
*   **ThemeToggle.vue**: Bascule du thème clair/sombre

6\. Adaptations mobile-first avec Tailwind CSS
----------------------------------------------

### 6.1 Principes de design

*   Utilisation des classes utilitaires Tailwind pour tous les styles
*   Design responsive avec approche mobile-first
*   Optimisation pour les écrans tactiles
*   Éléments suffisamment grands pour être manipulés au doigt
*   Optimisation des contrastes pour la lisibilité en extérieur

### 6.2 Breakpoints

*   Mobile: < 640px (sm)
*   Tablette: 640px - 768px (md)
*   Desktop petit: 768px - 1024px (lg)
*   Desktop large: > 1024px (xl)

### 6.3 Adaptations spécifiques

*   Réorganisation verticale sur mobile des éléments horizontaux
*   Touch targets d'au moins 44x44px pour les boutons
*   Réduction des padding/margin sur petit écran
*   Menus déroulants adaptés au touch

7\. Considérations techniques importantes
-----------------------------------------

### 7.1 Performance

*   Virtualisation possible des longues listes
*   Chargement paresseux des sections fermées
*   Optimisation des calculs de progression (mémorisation)

### 7.2 Accessibilité

*   Contraste suffisant pour les thèmes clair et sombre
*   Support du clavier pour toutes les actions
*   Structure sémantique avec ARIA où nécessaire
*   Support des lecteurs d'écran

### 7.3 Sécurité

*   Validation des données importées
*   Gestion des erreurs de parsing JSON
*   Limitations de taille pour les notes

### 7.4 Extensibilité

*   Architecture modulaire permettant l'ajout de fonctionnalités
*   Possibilité future d'ajouter une API backend
*   Modèle de données flexible pour accueillir de nouveaux attributs

8\. Contraintes et limites
--------------------------

### 8.1 Stockage

*   Limitation du localStorage (~5-10 MB selon les navigateurs)
*   Pas de synchronisation multi-appareils sans backend

### 8.2 Compatibilité navigateurs

*   Support des navigateurs modernes (Edge, Chrome, Firefox, Safari)
*   Pas de support pour IE11

9\. Fonctionnalités futures potentielles
----------------------------------------

### 9.1 Court terme

*   Export PDF/impression
*   Recherche dans l'inventaire
*   Mode hors-ligne explicite avec Service Worker
*   Statistiques plus détaillées

### 9.2 Moyen terme

*   Synchronisation backend
*   Inventaires multiples
*   Partage d'inventaires
*   Mode collaboratif
*   QR codes pour les "box"

10\. Critères de succès
-----------------------

### 10.1 Techniques

*   Application fonctionnelle sur mobile et desktop
*   Temps de chargement < 2s
*   Temps de réponse < 100ms pour les interactions
*   Stockage efficace des données

### 10.2 Utilisateur

*   Interface intuitive nécessitant peu d'explications
*   Réduction de la charge cognitive pour les utilisateurs ADHD
*   Feedback visuel clair et immédiat
*   Progression facilement identifiable

Ce cahier des charges couvre toutes les fonctionnalités et exigences techniques pour recréer l'application d'inventaire GN avec Vue.js et Tailwind CSS, en adoptant une approche mobile-first. Les spécifications sont suffisamment détaillées pour permettre un développement autonome, tout en restant flexibles pour les choix d'implémentation spécifiques.

Réessayer