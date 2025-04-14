# Inventaire GN - Application de gestion d'inventaire

Cette application est conçue pour faciliter la gestion d'inventaire pour les événements de Grandeur Nature (GN), en permettant un suivi structuré du matériel nécessaire. Elle est spécifiquement adaptée pour réduire la charge cognitive et aider les personnes avec TDAH/ADHD.

## Fonctionnalités

- Suivi d'inventaire par sections et sous-sections
- Marquage des éléments avec différents statuts (présent, à trouver, à acheter, etc.)
- Gestion des quantités fixes et variables
- Suivi de la progression globale et par section
- Filtrage par statut pour organiser les tâches
- Mode clair/sombre
- Import/export des données au format JSON
- Persistance des données via localStorage
- Design responsive et mobile-first

## Technologies utilisées

- Vue.js 3 (Composition API)
- Tailwind CSS
- Vite

## Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_DEPOT]
   cd inventaire-gn
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. L'application démarre avec un inventaire vide :
   - Utilisez le bouton "Importer" pour charger un fichier JSON d'inventaire
   - Ou commencez avec l'inventaire vide et ajoutez des éléments manuellement (dans une version future)

4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

5. Pour construire pour la production :
   ```bash
   npm run build
   ```

## Structure des données

L'application attend un fichier JSON avec la structure suivante :

```json
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
            "variableQuantity": true/false (optionnel),
            "boxId": "identifiant_caisse" (optionnel)
          }
        ]
      }
    }
  }
}
```

## Guide d'utilisation

### Navigation dans l'inventaire
- Cliquez sur une section pour l'ouvrir/fermer
- Utilisez les filtres pour voir les éléments par statut

### Gestion des éléments
- Bouton "OK" : marque un élément comme présent
- Menu déroulant : change le statut d'un élément
- Icône de note : ajoute/modifie une note
- Champ de quantité : modifie la quantité actuelle

### Import/Export
- Bouton "Exporter" : sauvegarde l'inventaire actuel dans un fichier JSON
- Bouton "Importer" : charge un fichier JSON d'inventaire

### Thème
- Icône en haut à droite : bascule entre le thème clair et sombre

## Adaptation mobile

L'application est conçue avec une approche mobile-first et s'adapte à tous les formats d'écran :
- Mobile : < 640px
- Tablette : 640px - 768px
- Desktop : > 768px

## Développement

### Structure du projet

```
/src
├── assets/
│   └── main.css                 (styles Tailwind)
├── components/
│   ├── inventory/               (composants d'inventaire)
│   │   ├── FilteredView.vue
│   │   ├── InventoryManager.vue
│   │   ├── InventorySections.vue
│   │   ├── ProgressSection.vue
│   │   └── StatusFilter.vue
│   └── ui/                      (composants d'UI génériques)
│       ├── CelebrationModal.vue
│       ├── NoteModal.vue
│       ├── ThemeToggle.vue
│       └── Toast.vue
├── composables/                 (logique réutilisable)
│   ├── useInventory.js
│   ├── useStorage.js
│   └── useTheme.js
├── utils/                       (utilitaires)
│   └── initData.js
├── App.vue
└── main.js
```

### Personnalisation

- **Thème** : Modifiez les couleurs dans `tailwind.config.js`
- **Statuts** : Ajoutez ou modifiez les statuts dans `useInventory.js`
- **Interface** : Personnalisez les composants dans `/components`

## Contributeurs

- [Votre nom]

## Licence

[Licence à définir]