# Guide de déploiement et d'hébergement

Cette application d'inventaire est une Single Page Application (SPA) qui peut être hébergée facilement de plusieurs façons. Voici quelques options pour la déployer :

## Option 1 : Utilisation locale

L'option la plus simple est d'utiliser l'application localement :

1. Téléchargez les trois fichiers (`index.html`, `styles.css`, `app.js`) dans un dossier sur votre ordinateur
2. Ouvrez simplement le fichier `index.html` dans votre navigateur
3. L'application s'exécutera localement et enregistrera les données dans le stockage local de votre navigateur

**Avantage** : Simple, fonctionne hors ligne, pas besoin d'hébergement
**Inconvénient** : Les données sont liées à un seul appareil et navigateur

## Option 2 : Hébergement statique gratuit

Pour rendre l'application accessible depuis n'importe quel appareil :

### GitHub Pages

1. Créez un compte GitHub si vous n'en avez pas
2. Créez un nouveau dépôt public
3. Téléversez vos fichiers dans ce dépôt
4. Activez GitHub Pages dans les paramètres du dépôt
5. Votre application sera disponible à l'adresse `https://[votre-nom-utilisateur].github.io/[nom-du-repo]`

### Netlify Drop

1. Visitez [Netlify Drop](https://app.netlify.com/drop)
2. Glissez-déposez votre dossier contenant les trois fichiers
3. Netlify générera une URL pour votre application

**Avantage** : Accès depuis n'importe quel appareil, simple à configurer
**Inconvénient** : Les données restent stockées dans le navigateur de l'utilisateur

## Option 3 : Ajouter une persistance backend (plus avancé)

Pour partager l'inventaire entre plusieurs utilisateurs :

1. Créez une API REST simple avec Node.js ou un autre langage
2. Modifiez `app.js` pour remplacer les fonctions `loadInventoryData` et `saveInventoryData` pour communiquer avec votre API
3. Hébergez l'API sur un service comme Heroku, Render, ou Vercel

Voici un exemple de modification de la fonction `saveInventoryData` :

```javascript
const saveInventoryData = async () => {
    try {
        // Sauvegarde locale comme backup
        localStorage.setItem('inventoryData', JSON.stringify(inventory.value));
        
        // Envoi au serveur
        const response = await fetch('https://votre-api.com/saveInventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventory.value)
        });
        
        if (response.ok) {
            showToast('Données sauvegardées sur le serveur');
        } else {
            showToast('Erreur lors de la sauvegarde sur le serveur');
        }
    } catch (error) {
        console.error('Error saving data:', error);
        showToast('Erreur de connexion au serveur');
    }
};
```

## Option 4 : Hébergement sur un site web existant

Si vous avez déjà un site web, vous pouvez simplement ajouter ces fichiers à votre serveur web existant.

## Utilisation en tant qu'application mobile

Pour une expérience plus native sur mobile :

### Option 1 : Ajouter à l'écran d'accueil

Instructez vos utilisateurs à :
1. Ouvrir l'application dans Safari (iOS) ou Chrome (Android)
2. Utiliser la fonction "Ajouter à l'écran d'accueil"

### Option 2 : Transformer en PWA (Progressive Web App)

Pour une expérience encore plus proche d'une application native :

1. Créez un fichier `manifest.json` avec les informations de votre application
2. Ajoutez un service worker (`sw.js`)
3. Mettez à jour `index.html` pour référencer ces fichiers

Exemple de `manifest.json` :
```json
{
  "name": "Inventaire GN",
  "short_name": "Inventaire",
  "description": "Application d'inventaire pour GN adaptée ADHD",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4a6fa5",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Sécurisation

Si vous implémentez un backend :

1. Ajoutez un système d'authentification pour protéger vos données
2. Utilisez HTTPS pour toutes les communications
3. Considérez l'ajout de limites de taux pour éviter les abus