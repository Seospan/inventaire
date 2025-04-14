// Ce fichier gère le chargement des données initiales

// Inventaire vide par défaut
const emptyInventory = {
    "sample_section": {
      "title": "Section d'exemple",
      "subsections": {
        "sample_subsection": {
          "title": "Sous-section d'exemple",
          "items": [
            {
              "name": "Pour commencer, importez un fichier d'inventaire",
              "isBox": false,
              "status": null,
              "inTruck": false,
              "note": "Utilisez le bouton Importer en bas à gauche",
              "currentQuantity": null
            }
          ]
        }
      }
    }
  };
  
  /**
   * Retourne les données d'inventaire par défaut (vide)
   * @returns {Object} Les données d'inventaire vides
   */
  export function getDefaultInventoryData() {
    return emptyInventory;
  }
  
  /**
   * Prépare les données d'inventaire en ajoutant les propriétés manquantes si nécessaire
   * @param {Object} data Données brutes de l'inventaire
   * @returns {Object} Données d'inventaire avec les propriétés par défaut ajoutées
   */
  export function prepareInventoryData(data) {
    if (!data) return getDefaultInventoryData();
    
    // Clone pour ne pas modifier les données originales
    const preparedData = JSON.parse(JSON.stringify(data));
    
    // Parcourir toutes les sections
    Object.keys(preparedData).forEach(sectionKey => {
      const section = preparedData[sectionKey];
      
      // Assurer que chaque section a une propriété subsections
      if (!section.subsections) {
        section.subsections = {};
      }
      
      // Parcourir toutes les sous-sections
      Object.keys(section.subsections).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        // Assurer que chaque sous-section a une propriété items
        if (!subsection.items) {
          subsection.items = [];
        }
        
        // Parcourir tous les éléments
        subsection.items.forEach(item => {
          // Assurer que chaque élément a les propriétés de base
          if (item.status === undefined) item.status = null;
          if (item.inTruck === undefined) item.inTruck = false;
          if (item.note === undefined) item.note = '';
          
          // Gérer les propriétés spécifiques aux types d'éléments
          if (item.isBox === undefined) item.isBox = false;
          if (item.currentQuantity === undefined) item.currentQuantity = null;
        });
      });
    });
    
    return preparedData;
  }
  
  /**
   * Valide la structure du fichier d'inventaire importé
   * @param {Object} data Données à valider
   * @returns {boolean} true si les données sont valides, false sinon
   */
  export function validateInventoryData(data) {
    if (!data || typeof data !== 'object') return false;
    
    // Vérifier que c'est un objet avec des sections
    if (Object.keys(data).length === 0) return false;
    
    // Vérifier que chaque section a au moins un titre
    for (const sectionKey in data) {
      const section = data[sectionKey];
      if (!section.title) return false;
      
      // Vérifier que chaque section a des sous-sections
      if (!section.subsections || typeof section.subsections !== 'object') return false;
      
      for (const subsectionKey in section.subsections) {
        const subsection = section.subsections[subsectionKey];
        
        // Vérifier que chaque sous-section a un titre et des éléments
        if (!subsection.title) return false;
        if (!Array.isArray(subsection.items)) return false;
        
        // Vérifier que chaque élément a au moins un nom
        for (const item of subsection.items) {
          if (!item.name) return false;
        }
      }
    }
    
    return true;
  }