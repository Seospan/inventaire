// Gestion de la persistance des données dans le localStorage

export function useStorage() {
    const STORAGE_KEY = 'inventaire-gn-data';
    
    const saveData = (data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
        return false;
      }
    };
    
    const loadData = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return null;
      }
    };
    
    const clearData = () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      } catch (error) {
        console.error('Erreur lors de la suppression des données:', error);
        return false;
      }
    };
    
    const exportData = () => {
      const data = loadData();
      if (!data) return null;
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      return URL.createObjectURL(blob);
    };
    
    const importData = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (saveData(data)) {
              resolve(data);
            } else {
              reject(new Error('Échec de la sauvegarde des données importées'));
            }
          } catch (error) {
            reject(new Error('Format de fichier invalide'));
          }
        };
        
        reader.onerror = () => reject(new Error('Échec de la lecture du fichier'));
        
        reader.readAsText(file);
      });
    };
    
    return {
      saveData,
      loadData,
      clearData,
      exportData,
      importData
    };
  }