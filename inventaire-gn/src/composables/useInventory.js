// Gestion de l'inventaire et de son état
import { ref, computed, watch } from 'vue';
import { useStorage } from './useStorage';
import { prepareInventoryData } from '../utils/initData';

export function useInventory() {
  const { saveData, loadData } = useStorage();
  
  // États principaux
  const inventory = ref({});
  const isLoading = ref(true);
  const openSections = ref([]);
  const activeStatusDropdown = ref(null);
  const currentFilter = ref('all');
  
  // États des modales et notifications
  const noteModalActive = ref(false);
  const currentNote = ref('');
  const currentItem = ref(null);
  const celebrationActive = ref(false);
  const toastActive = ref(false);
  const toastMessage = ref('');
  
  // Constantes pour les statuts
  const STATUS = {
    PRESENT: 'present',
    TO_FIND: 'to-find',
    TO_BUY: 'to-buy',
    TO_REPAIR: 'to-repair',
    NOT_NEEDED: 'not-needed',
    IN_TRUCK: 'in-truck',
    NULL: null
  };
  
  // Chargement initial des données
  const loadInventory = async (defaultData = null) => {
    isLoading.value = true;
    
    // Essaie de charger depuis le localStorage
    let data = loadData();
    
    // Si pas de données en localStorage et des données par défaut sont fournies
    if (!data && defaultData) {
      data = defaultData;
      saveData(data); // Sauvegarde les données par défaut
    }
    
    if (data) {
      // S'assurer que les données sont bien structurées
      inventory.value = prepareInventoryData(data);
    }
    
    isLoading.value = false;
    return data;
  };
  
  // Sauvegarde de l'inventaire
  const saveInventory = () => {
    return saveData(inventory.value);
  };
  
  // Mise à jour du statut d'un élément
  const updateItemStatus = (item, status) => {
    if (item) {
      const oldStatus = item.status;
      item.status = status;
      
      // Si le statut change pour "in-truck", mettre également inTruck à true
      if (status === STATUS.IN_TRUCK) {
        item.inTruck = true;
      } else if (oldStatus === STATUS.IN_TRUCK) {
        // Si on quitte le statut "in-truck", remettre inTruck à false
        item.inTruck = false;
      }
      
      saveInventory();
      
      // Notification de succès
      showToast(`Statut mis à jour : ${getStatusLabel(status)}`);
      
      // Si l'élément est une box, vérifier si tous les éléments qu'elle contient 
      // sont également présents
      if (item.isBox && status === STATUS.PRESENT) {
        checkBoxContents(item.boxId);
      }
    }
  };
  
  // Vérification du contenu d'une box
  const checkBoxContents = (boxId) => {
    if (!boxId) return;
    
    // Trouver tous les éléments qui sont dans cette box
    const boxContents = findBoxContents(boxId);
    
    // Si des éléments ne sont pas marqués comme présents, suggérer de les vérifier
    const notPresent = boxContents.filter(item => 
      item.status !== STATUS.PRESENT && item.status !== STATUS.IN_TRUCK && item.status !== STATUS.NOT_NEEDED
    );
    
    if (notPresent.length > 0) {
      showToast(`Attention: ${notPresent.length} élément(s) de cette box ne sont pas marqués comme présents.`, 'warning', 5000);
    }
  };
  
  // Trouver tous les éléments contenus dans une box
  const findBoxContents = (boxId) => {
    const contents = [];
    
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.boxId === boxId) {
            contents.push(item);
          }
        });
      });
    });
    
    return contents;
  };
  
  // Mise à jour de la note d'un élément
  const updateItemNote = (item, note) => {
    if (item) {
      item.note = note;
      saveInventory();
      showToast('Note enregistrée');
    }
  };
  
  // Mise à jour de la quantité d'un élément
  const updateItemQuantity = (item, quantity) => {
    if (item) {
      item.currentQuantity = quantity === '' ? null : Number(quantity);
      saveInventory();
    }
  };
  
  // Obtenir le libellé d'un statut
  const getStatusLabel = (status) => {
    switch (status) {
      case STATUS.PRESENT: return 'Présent';
      case STATUS.TO_FIND: return 'À trouver';
      case STATUS.TO_BUY: return 'À acheter';
      case STATUS.TO_REPAIR: return 'À réparer';
      case STATUS.NOT_NEEDED: return 'Non pertinent';
      case STATUS.IN_TRUCK: return 'Dans le camion';
      case STATUS.NULL: 
      default: return 'À vérifier';
    }
  };
  
  // Obtenir la classe CSS correspondant à un statut
  const getStatusClass = (status) => {
    switch (status) {
      case STATUS.PRESENT: return 'bg-status-present';
      case STATUS.TO_FIND: return 'bg-status-to-find';
      case STATUS.TO_BUY: return 'bg-status-to-buy';
      case STATUS.TO_REPAIR: return 'bg-status-to-repair';
      case STATUS.NOT_NEEDED: return 'bg-status-not-needed';
      case STATUS.IN_TRUCK: return 'bg-status-in-truck';
      case STATUS.NULL:
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };
  
  // Filtrer les éléments par statut
  const filteredItems = computed(() => {
    if (currentFilter.value === 'all') return [];
    
    const items = [];
    
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (
            (currentFilter.value === 'null' && item.status === null) ||
            (item.status === currentFilter.value)
          ) {
            items.push({
              ...item,
              sectionTitle: section.title,
              subsectionTitle: subsection.title
            });
          }
        });
      });
    });
    
    return items;
  });
  
  // Calcul des métriques pour la progression
  const metrics = computed(() => {
    let total = 0;
    let present = 0;
    let toFind = 0;
    let toBuy = 0;
    let toRepair = 0;
    let notNeeded = 0;
    let inTruck = 0;
    let boxCount = 0;
    let boxContentCount = 0;
    
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          // Compter les box
          if (item.isBox) {
            boxCount++;
          }
          
          // Compter les éléments contenus dans des box
          if (item.boxId) {
            boxContentCount++;
          }
          
          // On exclut du total les éléments marqués comme "non pertinents"
          if (item.status !== STATUS.NOT_NEEDED) {
            total++;
            
            switch (item.status) {
              case STATUS.PRESENT:
                present++;
                break;
              case STATUS.TO_FIND:
                toFind++;
                break;
              case STATUS.TO_BUY:
                toBuy++;
                break;
              case STATUS.TO_REPAIR:
                toRepair++;
                break;
              case STATUS.IN_TRUCK:
                inTruck++;
                break;
            }
          } else {
            notNeeded++;
          }
        });
      });
    });
    
    // Calcul de la progression globale
    const progress = total > 0 
      ? Math.round(((present + inTruck) / total) * 100) 
      : 0;
    
    return {
      total,
      present,
      toFind,
      toBuy,
      toRepair,
      notNeeded,
      inTruck,
      progress,
      boxCount,
      boxContentCount
    };
  });
  
  // Gestion des toasts (notifications)
  const showToast = (message, type = 'info', duration = 3000) => {
    toastMessage.value = message;
    toastActive.value = true;
    
    setTimeout(() => {
      toastActive.value = false;
      toastMessage.value = '';
    }, duration);
  };
  
  // Vérifier si une section est complète
  const isSectionComplete = (sectionKey) => {
    const section = inventory.value[sectionKey];
    if (!section) return false;
    
    let total = 0;
    let completed = 0;
    
    Object.keys(section.subsections || {}).forEach(subsectionKey => {
      const subsection = section.subsections[subsectionKey];
      
      (subsection.items || []).forEach(item => {
        if (item.status !== STATUS.NOT_NEEDED) {
          total++;
          if (item.status === STATUS.PRESENT || item.status === STATUS.IN_TRUCK) {
            completed++;
          }
        }
      });
    });
    
    return total > 0 && total === completed;
  };
  
  // Gestion de la modal de célébration
  const checkSectionCompletion = (sectionKey) => {
    if (isSectionComplete(sectionKey)) {
      celebrationActive.value = true;
      setTimeout(() => {
        celebrationActive.value = false;
      }, 3000);
    }
  };
  
  // Obtenir les informations d'un élément box par son ID
  const getBoxById = (boxId) => {
    let foundBox = null;
    
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.isBox && item.boxId === boxId) {
            foundBox = item;
          }
        });
      });
    });
    
    return foundBox;
  };
  
  // Mise à jour automatique du statut des boxes en fonction de leur contenu
  const updateBoxStatusFromContents = (boxId) => {
    // Trouver la box
    const box = getBoxById(boxId);
    if (!box) return;
    
    // Trouver les éléments de cette box
    const contents = findBoxContents(boxId);
    if (contents.length === 0) return;
    
    // Vérifier si tous les éléments sont présents/dans le camion
    const allPresent = contents.every(item => 
      item.status === STATUS.PRESENT || 
      item.status === STATUS.IN_TRUCK || 
      item.status === STATUS.NOT_NEEDED
    );
    
    // Vérifier si tous les éléments sont dans le camion
    const allInTruck = contents.every(item => 
      item.status === STATUS.IN_TRUCK || 
      item.status === STATUS.NOT_NEEDED
    );
    
    // Mettre à jour le statut de la box en fonction
    if (allInTruck && box.status !== STATUS.IN_TRUCK) {
      updateItemStatus(box, STATUS.IN_TRUCK);
    } else if (allPresent && !allInTruck && box.status !== STATUS.PRESENT) {
      updateItemStatus(box, STATUS.PRESENT);
    }
  };
  
  return {
    // États
    inventory,
    isLoading,
    openSections,
    activeStatusDropdown,
    noteModalActive,
    currentNote,
    currentItem,
    celebrationActive,
    toastActive,
    toastMessage,
    currentFilter,
    
    // Constantes
    STATUS,
    
    // Méthodes
    loadInventory,
    saveInventory,
    updateItemStatus,
    updateItemNote,
    updateItemQuantity,
    getStatusLabel,
    getStatusClass,
    showToast,
    checkSectionCompletion,
    findBoxContents,
    getBoxById,
    updateBoxStatusFromContents,
    
    // Computed
    filteredItems,
    metrics
  };
}