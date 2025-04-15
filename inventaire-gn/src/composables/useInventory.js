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
    console.log('Saving inventory to storage...');
    const result = saveData(inventory.value);
    console.log('Inventory saved:', result);
    return result;
  };
  
  // Mise à jour du statut d'un élément
  const updateItemStatus = (item, status) => {
    if (item) {
      const oldStatus = item.status;
      item.status = status;
      
      // Si le statut change pour "in-truck", mettre également inTruck à true
      if (status === STATUS.IN_TRUCK) {
        item.inTruck = true;
      } else if (status === STATUS.PRESENT) {
        item.inTruck = false;
      }

      saveInventory();
      
      // Notification de succès
      showToast(`Statut mis à jour : ${getStatusLabel(status)}`);
      
      // Si l'élément est associé à une box, mettre à jour le statut de la box
      if (item.boxId) {
        const parentBox = getBoxById(item.boxId);
        if (parentBox) {
          updateBoxStatusFromContents(parentBox);
        }
      }
      
      // Si l'élément est une box, vérifier si tous les éléments qu'elle contient 
      // sont également présents
      if (item.isBox) {
        checkBoxContents(item);
        // Mettre à jour le statut de la box en fonction des éléments qu'elle contient
        updateBoxStatusFromContents(item);
      }
      
      // Recalcul des métriques après changement
      calculateMetrics();
    }
  };
  
  // Obtenir une box par son ID
  const getBoxById = (boxId) => {
    let foundBox = null;
    
    // Parcourir toutes les sections pour trouver la box
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
  
  // Récupérer tous les éléments contenus dans une box
  const getAllBoxItems = (box) => {
    if (!box || !box.contents) return [];
    
    const allItems = [];
    
    Object.keys(box.contents).forEach(subsectionKey => {
      const subsection = box.contents[subsectionKey];
      (subsection.items || []).forEach(item => {
        allItems.push(item);
      });
    });
    
    return allItems;
  };
  
  // Vérification du contenu d'une box
  const checkBoxContents = (box) => {
    if (!box || !box.isBox || !box.contents) return;
    
    // Trouver tous les éléments qui sont dans cette box
    const boxContents = getAllBoxItems(box);
    
    // Si des éléments ne sont pas marqués comme présents, suggérer de les vérifier
    const notPresent = boxContents.filter(item => 
      item.status !== STATUS.PRESENT && item.status !== STATUS.IN_TRUCK && item.status !== STATUS.NOT_NEEDED
    );
    
    if (notPresent.length > 0) {
      showToast(`Attention: ${notPresent.length} élément(s) de cette box ne sont pas marqués comme présents.`, 'warning', 5000);
    }
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
  
  // Mettre à jour le statut d'une box en fonction de son contenu
  const updateBoxStatusFromContents = (box) => {
    if (!box || !box.isBox) return;
    
    // Récupérer tous les éléments contenus dans la box
    const contents = getAllBoxItems(box);
    if (contents.length === 0) return;
    
    // Compter le statut de tous les contenus
    const statusCounts = {
      [STATUS.PRESENT]: 0,
      [STATUS.TO_FIND]: 0,
      [STATUS.TO_BUY]: 0,
      [STATUS.TO_REPAIR]: 0,
      [STATUS.NOT_NEEDED]: 0,
      [STATUS.IN_TRUCK]: 0,
      'null': 0  // Pour le statut null
    };
    
    contents.forEach(item => {
      const status = item.status || 'null';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Déterminer le statut de la box en fonction du statut de son contenu
    if (statusCounts[STATUS.IN_TRUCK] === contents.length) {
      // Tous les éléments sont dans le camion - marquer la box comme dans le camion
      box.status = STATUS.IN_TRUCK;
    } else if (statusCounts[STATUS.IN_TRUCK] + statusCounts[STATUS.PRESENT] === contents.length) {
      // Tous les éléments sont présents ou dans le camion - marquer la box comme présente
      box.status = STATUS.PRESENT;
    } else if (statusCounts[STATUS.TO_FIND] > 0) {
      // Certains éléments sont à trouver - marquer la box comme à trouver
      box.status = STATUS.TO_FIND;
    } else if (statusCounts[STATUS.TO_BUY] > 0) {
      // Certains éléments sont à acheter - marquer la box comme à acheter
      box.status = STATUS.TO_BUY;
    } else if (statusCounts[STATUS.TO_REPAIR] > 0) {
      // Certains éléments sont à réparer - marquer la box comme à réparer
      box.status = STATUS.TO_REPAIR;
    } else if (statusCounts['null'] > 0) {
      // Certains éléments n'ont pas été vérifiés
      box.status = null;
    } else {
      // Statuts mixtes ou cas spécial
      if (statusCounts[STATUS.NOT_NEEDED] === contents.length) {
        // Tous les contenus ne sont pas nécessaires
        box.status = STATUS.NOT_NEEDED;
      } else {
        // Mixte - par défaut à vérifier
        box.status = null;
      }
    }
    
    // Sauvegarder les changements
    saveInventory();
  };
  
  // Calcul des métriques pour la progression
  const calculateMetrics = () => {
    let total = 0;
    let present = 0;
    let toFind = 0;
    let toBuy = 0;
    let toRepair = 0;
    let notNeeded = 0;
    let inTruck = 0;
    let boxCount = 0;
    let boxContentCount = 0;
    
    // Parcourir toutes les sections
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          // Compter les box
          if (item.isBox) {
            boxCount++;
            
            // Compter les éléments contenus dans les box
            if (item.contents) {
              Object.keys(item.contents).forEach(contentSubsectionKey => {
                const contentSubsection = item.contents[contentSubsectionKey];
                
                (contentSubsection.items || []).forEach(contentItem => {
                  boxContentCount++;
                  
                  // On exclut du total les éléments marqués comme "non pertinents"
                  if (contentItem.status !== STATUS.NOT_NEEDED) {
                    total++;
                    
                    switch (contentItem.status) {
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
            }
          }
          
          // Compter les éléments principaux (qui ne sont pas dans des box)
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
    
    // Calcul de la progression globale - consider both present and in-truck as "complete"
    const progress = total > 0 
      ? Math.round(((present + inTruck) / total) * 100) 
      : 0;
    
    metrics.value = {
      total,
      present,
      toFind,
      toBuy,
      toRepair,
      notNeeded,
      inTruck, // We still track this, but won't display it in the UI
      progress,
      boxCount,
      boxContentCount
    };
  };
  
  // Initialiser les métriques
  const metrics = ref({
    total: 0,
    present: 0,
    toFind: 0,
    toBuy: 0,
    toRepair: 0,
    notNeeded: 0,
    inTruck: 0,
    progress: 0,
    boxCount: 0,
    boxContentCount: 0
  });
  
  // Recalculer les métriques lors des changements d'inventaire
  watch(inventory, () => {
    calculateMetrics();
  }, { deep: true });
  
  // Filtrer les éléments par statut
  const filteredItems = computed(() => {
    if (currentFilter.value === 'all') return [];
    
    const items = [];
    
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          // Vérifier si cet élément standard correspond au filtre
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
          
          // Si c'est une box, vérifier son contenu également
          if (item.isBox && item.contents) {
            Object.keys(item.contents).forEach(contentSubsectionKey => {
              const contentSubsection = item.contents[contentSubsectionKey];
              
              (contentSubsection.items || []).forEach(contentItem => {
                if (
                  (currentFilter.value === 'null' && contentItem.status === null) || (contentItem.status === currentFilter.value)
                ) {
                  items.push({
                    ...contentItem,
                    sectionTitle: section.title,
                    subsectionTitle: `${subsection.title} > ${item.name} > ${contentSubsection.title}`
                  });
                }
              });
            });
          }
        });
      });
    });
    
    return items;
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
          
          // Compter également les contenus des boxes
          if (item.isBox && item.contents) {
            const boxItems = getAllBoxItems(item);
            boxItems.forEach(boxItem => {
              if (boxItem.status !== STATUS.NOT_NEEDED) {
                total++;
                if (boxItem.status === STATUS.PRESENT || boxItem.status === STATUS.IN_TRUCK) {
                  completed++;
                }
              }
            });
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
  
  // Calculer les métriques initiales
  calculateMetrics();
  
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
    metrics,
    
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
    getBoxById,
    getAllBoxItems,
    updateBoxStatusFromContents,
    
    // Computed
    filteredItems
  };
}