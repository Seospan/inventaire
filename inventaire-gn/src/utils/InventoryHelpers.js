// Fonctions utilitaires pour manipuler l'inventaire

/**
 * Calcule les statistiques globales de l'inventaire
 * @param {Object} inventory - L'inventaire complet
 * @returns {Object} - Les statistiques calculées
 */
export const calculateStats = (inventory) => {
    const stats = {
      totalItems: 0,
      presentItems: 0,
      toFindItems: 0,
      toBuyItems: 0,
      toRepairItems: 0,
      notNeededItems: 0,
      inTruckItems: 0
    };
    
    Object.keys(inventory).forEach(sectionKey => {
      const section = inventory[sectionKey];
      
      Object.keys(section.subsections).forEach(subKey => {
        const subsection = section.subsections[subKey];
        stats.totalItems += subsection.items.length;
        
        subsection.items.forEach(item => {
          if (item.status === 'present') stats.presentItems++;
          else if (item.status === 'to-find') stats.toFindItems++;
          else if (item.status === 'to-buy') stats.toBuyItems++;
          else if (item.status === 'to-repair') stats.toRepairItems++;
          else if (item.status === 'not-needed') stats.notNeededItems++;
          else if (item.status === 'in-truck') stats.inTruckItems++;
        });
      });
    });
    
    return stats;
  };
  
  /**
   * Génère un rapport des éléments par statut
   * @param {Object} inventory - L'inventaire complet
   * @param {String} status - Le statut à filtrer
   * @returns {Array} - La liste des éléments avec ce statut
   */
  export const generateStatusReport = (inventory, status) => {
    const items = [];
    
    Object.keys(inventory).forEach(sectionKey => {
      const section = inventory[sectionKey];
      
      Object.keys(section.subsections).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        subsection.items.forEach((item, itemIndex) => {
          if (item.status === status) {
            items.push({
              ...item,
              sectionKey,
              subsectionKey,
              itemIndex,
              sectionTitle: section.title,
              subsectionTitle: subsection.title
            });
          }
        });
      });
    });
    
    return items;
  };
  
  /**
   * Transforme un inventaire en format imprimable
   * @param {Object} inventory - L'inventaire complet
   * @returns {String} - Texte formaté pour impression
   */
  export const getPrintableInventory = (inventory) => {
    let output = "INVENTAIRE\n\n";
    
    Object.keys(inventory).forEach(sectionKey => {
      const section = inventory[sectionKey];
      output += `## ${section.title}\n`;
      
      Object.keys(section.subsections).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        output += `### ${subsection.title}\n`;
        
        subsection.items.forEach(item => {
          const status = item.status ? `[${item.status.toUpperCase()}]` : '[À VÉRIFIER]';
          const quantity = item.currentQuantity !== null ? ` (${item.currentQuantity})` : '';
          output += `- ${status} ${item.name}${quantity}\n`;
          if (item.note) output += `  Note: ${item.note}\n`;
        });
        
        output += '\n';
      });
      
      output += '\n';
    });
    
    return output;
  };