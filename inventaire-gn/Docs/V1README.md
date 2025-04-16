Documentation Technique - Inventaire GN
=======================================

Vue d'ensemble du projet
------------------------

Ce projet est une application web conçue pour faciliter la gestion d'inventaire pour les événements de Grandeur Nature (GN). Elle permet un suivi structuré du matériel nécessaire, avec une attention particulière aux besoins des personnes avec TDAH/ADHD, en offrant une interface intuitive qui réduit la charge cognitive.

Technologies utilisées
----------------------

*   **Framework**: Vue.js 3 (Composition API)
*   **CSS**: Tailwind CSS pour une approche mobile-first
*   **Build Tool**: Vite
*   **Persistance**: LocalStorage pour le stockage côté client

Structure du projet
-------------------

    /src
    ├── assets/
    │   └── main.css                 (styles Tailwind)
    ├── components/
    │   ├── inventory/
    │   │   ├── FilteredView.vue     (vue filtrée par statut)
    │   │   ├── InventoryManager.vue (composant principal)
    │   │   ├── InventorySections.vue (arborescence de l'inventaire)
    │   │   ├── ProgressSection.vue  (barre de progression)
    │   │   └── StatusFilter.vue     (filtres par statut)
    │   └── ui/
    │       ├── BoxContentsModal.vue (modal de contenu d'une box)
    │       ├── CelebrationModal.vue (modal de célébration)
    │       ├── NoteModal.vue        (modal de notes)
    │       ├── ThemeToggle.vue      (bascule thème clair/sombre)
    │       └── Toast.vue            (notifications)
    ├── composables/                 (logique réutilisable)
    │   ├── useInventory.js          (gestion de l'inventaire)
    │   ├── useStorage.js            (persistance localStorage)
    │   └── useTheme.js              (gestion du thème)
    ├── utils/
    │   └── initData.js              (initialisation des données)
    ├── App.vue                      (composant racine)
    └── main.js                      (point d'entrée)

Modèle de données
-----------------

L'inventaire est structuré comme suit:

javascript

    {
      "section_key": {
        "title": "Titre de la section",
        "subsections": {
          "subsection_key": {
            "title": "Titre de la sous-section",
            "items": [
              {
                "name": "Nom de l'élément",
                "isBox": true/false,              // Si l'élément est un conteneur
                "boxId": "id_unique",             // ID unique si c'est une box
                "status": "present"/"to-find"/etc. // Statut de l'élément
                "inTruck": true/false,            // Si l'élément est dans le camion
                "note": "Note éventuelle",
                "currentQuantity": null/nombre,
                "targetQuantity": nombre,         // Quantité cible (optionnel)
                "isMinimumQuantity": true/false,  // Si quantité minimale (optionnel)
                "variableQuantity": true/false    // Si quantité variable (optionnel)
              }
            ]
          }
        }
      }
    }

Types d'éléments
----------------

*   **Éléments standard**: Statut simple (présent, à trouver, etc.)
*   **Éléments avec quantité fixe**: Nombre précis à vérifier
*   **Éléments avec quantité variable**: Nombre à entrer
*   **Éléments "box"**: Représentant des conteneurs (caisses, malles)

Statuts possibles des éléments
------------------------------

*   **À vérifier** (`null`): État initial
*   **Présent** (`present`): Élément trouvé et disponible
*   **À trouver** (`to-find`): Élément manquant à localiser
*   **À réparer** (`to-repair`): Élément présent mais nécessitant réparation
*   **À acheter** (`to-buy`): Élément à acquérir
*   **Non pertinent** (`not-needed`): Élément non nécessaire pour l'événement
*   **Dans le camion** (`in-truck`): Élément présent et chargé

Composants principaux
---------------------

### InventoryManager.vue

Composant principal qui orchestre tous les autres. Il gère:

*   Le chargement/sauvegarde des données
*   Les filtres et modales
*   L'import/export des données

### InventorySections.vue

Affiche l'arborescence complète de l'inventaire avec:

*   Sections dépliables/repliables
*   Affichage des éléments avec leur statut
*   Gestion des "boxes" et leur contenu

### BoxContentsModal.vue

Modal qui affiche le contenu d'une box:

*   Liste des éléments contenus
*   Statistiques des statuts
*   Actions pour marquer tous les éléments

### FilteredView.vue

Affiche les éléments filtrés par statut, permettant de:

*   Voir tous les éléments d'un statut spécifique
*   Modifier leur statut depuis cette vue

Fonctionnalités principales
---------------------------

1.  **Navigation hiérarchique**: Organisation en sections et sous-sections
2.  **Gestion de statuts**: Suivi de l'état de chaque élément
3.  **Gestion des boxes**: Relation entre conteneurs et leur contenu
4.  **Filtrage par statut**: Vue dédiée pour chaque statut
5.  **Suivi de progression**: Barre globale et compteurs par statut
6.  **Import/Export**: Sauvegarde et chargement des données JSON
7.  **Thème clair/sombre**: Adaptable aux préférences utilisateur

Relations particulières: Boxes et contenu
-----------------------------------------

Une fonctionnalité clé est la gestion des relations entre les "boxes" (conteneurs) et leur contenu:

*   Les éléments peuvent être marqués comme des "boxes" (`isBox: true`)
*   D'autres éléments peuvent référencer une box via le champ `boxId`
*   L'interface permet de voir le contenu d'une box et d'effectuer des actions groupées

Persistance des données
-----------------------

L'application utilise le localStorage pour persister les données:

*   Sauvegarde automatique à chaque modification
*   Possibilité d'exporter l'inventaire complet en JSON
*   Possibilité d'importer un fichier JSON pour restaurer l'inventaire

Interface adaptée TDAH/ADHD
---------------------------

L'interface est conçue spécifiquement pour réduire la charge cognitive:

*   Structure visuelle claire
*   Feedback immédiat après les actions
*   Célébrations visuelles pour les accomplissements
*   Codes couleur distincts pour les différents statuts
*   Possibilité de se concentrer sur une catégorie d'actions via les filtres