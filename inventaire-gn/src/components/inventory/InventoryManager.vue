<!-- src/components/inventory/InventoryManager.vue -->
<template>
  <div>
    <ProgressSection :metrics="metrics" />
      <StatusFilter 
        :currentFilter="currentFilter"
      :metrics="metrics"
        @change-filter="setCurrentFilter"
      />
      
    <FilteredView v-if="currentFilter !== 'all'"
        :filteredItems="filteredItems"
        :currentFilter="currentFilter"
        :getStatusLabel="getStatusLabel"
        @reset-filter="resetFilter"
        @mark-item="updateItemStatus"
        @change-status="openStatusDropdown"
      />
      
    <InventorySections v-if="currentFilter === 'all'"
        :inventory="inventory"
        :openSections="openSections"
        :activeStatusDropdown="activeStatusDropdown"
      v-bind="sectionProps"
      v-on="sectionEvents"
      />
      
    <ModalContainer
      :noteModal="noteModalState"
      :celebrationActive="celebrationActive"
      :boxModal="boxModalState"
      :toast="toastState"
      v-bind="modalProps"
      v-on="modalEvents"
      />
      
    <ActionButtons
      @import="importInventory"
      @export="exportInventory"
      @reset="resetInventory"
    />
      </div>
  </template>
  
  <script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useInventory } from '../../composables/useInventory';
  import { useStorage } from '../../composables/useStorage';
  import { prepareInventoryData, validateInventoryData } from '../../utils/initData';
  
  import ProgressSection from './ProgressSection.vue';
  import StatusFilter from './StatusFilter.vue';
  import FilteredView from './FilteredView.vue';
  import InventorySections from './InventorySections.vue';
  import NoteModal from '../ui/NoteModal.vue';
  import CelebrationModal from '../ui/CelebrationModal.vue';
  import Toast from '../ui/Toast.vue';
import ModalContainer from './ModalContainer.vue';
import ActionButtons from './ActionButtons.vue';
  
  // État pour le type de toast
  const toastType = ref('info');
  
  // Récupération des composables
  const { 
    inventory, isLoading, openSections, activeStatusDropdown,
    noteModalActive, currentNote, currentItem, celebrationActive,
    toastActive, toastMessage, currentFilter, STATUS,
    loadInventory, saveInventory, updateItemStatus, updateItemNote,
    getStatusLabel, getStatusClass, showToast, checkSectionCompletion,
    filteredItems, metrics, updateBoxStatusFromContents, getAllBoxItems
  } = useInventory();
  
  const { exportData, importData, clearData } = useStorage();
  
// Computed properties pour les props et les events
const sectionProps = computed(() => ({
  getStatusLabel,
  getStatusClass,
}));

const sectionEvents = computed(() => ({
  'toggle-section': toggleSection,
  'toggle-status': toggleStatusDropdown,
  'update-status': updateItemStatus,
  'mark-present': markItemPresent,
  'open-note': openNoteModal,
  'save': saveInventory,
  'mark-all-present': markAllBoxItemsPresent,
  'mark-all-in-truck': markAllBoxItemsInTruck,
  'navigate-to-box': navigateToBox
}));

const noteModalState = computed(() => ({
  active: noteModalActive.value,
  note: currentNote.value,
  title: currentItem.value ? currentItem.value.name : ''
}));

const toastState = computed(() => ({
  active: toastActive.value,
  message: toastMessage.value,
  type: toastType.value
}));

const boxModalState = computed(() => ({
  // Add properties for box modal if needed
}));

const modalProps = computed(() => ({
  // Additional modal props
}));

const modalEvents = computed(() => ({
  'close-note': closeNoteModal,
  'save-note': saveNote
}));

  // Chargement des données au démarrage
  onMounted(async () => {
    // Les données seront chargées depuis le localStorage par useInventory
    await loadInventory();
  });
  
  // Méthodes pour l'interface utilisateur
  const toggleSection = (sectionKey) => {
    const index = openSections.value.indexOf(sectionKey);
    if (index === -1) {
      openSections.value.push(sectionKey);
    } else {
      openSections.value.splice(index, 1);
    }
    
    // Vérifier si la section est complète après chaque ouverture
    if (index === -1) {
      checkSectionCompletion(sectionKey);
    }
  };
  
  const toggleStatusDropdown = (item) => {
    if (activeStatusDropdown.value === item) {
      activeStatusDropdown.value = null;
    } else {
      activeStatusDropdown.value = item;
    }
  };
  
  const openStatusDropdown = (item) => {
    activeStatusDropdown.value = item;
  };
  
  const markItemPresent = (item) => {
    updateItemStatus(item, STATUS.PRESENT);
  };
  
  const openNoteModal = (item) => {
    currentItem.value = item;
    currentNote.value = item.note || '';
    noteModalActive.value = true;
  };
  
  const closeNoteModal = () => {
    noteModalActive.value = false;
    currentItem.value = null;
    currentNote.value = '';
  };
  
  const saveNote = (note) => {
    if (currentItem.value) {
      updateItemNote(currentItem.value, note);
    }
  };
  
  const setCurrentFilter = (filter) => {
    currentFilter.value = filter;
  };
  
  const resetFilter = () => {
    currentFilter.value = 'all';
  };
  
  // Fonctions d'import/export
  const exportInventory = () => {
    if (Object.keys(inventory.value).length === 0 || 
        (Object.keys(inventory.value).length === 1 && inventory.value.sample_section)) {
      showToast('Aucune donnée à exporter', 'warning');
      return;
    }
  
    const url = exportData();
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventaire-gn-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Exportation réussie');
    } else {
      showToast('Erreur lors de l\'exportation', 'error');
    }
  };
  
  const importInventory = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const data = await importData(file);
      
      // Valider la structure des données importées
      if (!validateInventoryData(data)) {
        throw new Error('Format de données invalide');
      }
      
      // Préparer les données (ajouter les propriétés manquantes)
      const preparedData = prepareInventoryData(data);
      
      // Mettre à jour l'inventaire
      inventory.value = preparedData;
      saveInventory();
      
      showToast('Importation réussie');
      event.target.value = null; // Réinitialiser l'input file
    } catch (error) {
      showToast(`Erreur: ${error.message}`, 'error');
      event.target.value = null;
    }
  };
  
  // Fermer le dropdown de statut quand on clique ailleurs
  const handleDocumentClick = (event) => {
    if (activeStatusDropdown.value) {
      // Vérifier si le clic est à l'extérieur du dropdown
      activeStatusDropdown.value = null;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
  });
  
  // Réinitialisation de l'inventaire
  const resetInventory = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser l\'inventaire ? Toutes les données seront perdues.')) {
      // Supprimer les données du localStorage
      clearData();
      
      // Réinitialiser l'inventaire avec les données vides
      import('../../utils/initData').then(module => {
        inventory.value = module.getDefaultInventoryData();
        saveInventory();
        showToast('Inventaire réinitialisé');
      });
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
  
  // Marquer tous les éléments d'une box comme présents
  const markAllBoxItemsPresent = (boxId) => {
    const box = getBoxById(boxId);
    if (!box) return;
    
    // Récupérer tous les éléments de la box
    const contents = getAllBoxItems(box);
    
    contents.forEach(item => {
      if (item.status !== STATUS.PRESENT && item.status !== STATUS.NOT_NEEDED) {
        updateItemStatus(item, STATUS.PRESENT);
      }
    });
    
    // Mettre à jour le statut de la box elle-même
    updateBoxStatusFromContents(box);
    
    showToast('Tous les éléments ont été marqués comme présents');
  };
  
  // Marquer tous les éléments d'une box comme dans le camion
  const markAllBoxItemsInTruck = (boxId) => {
    const box = getBoxById(boxId);
    if (!box) return;
    
    // Récupérer tous les éléments de la box
    const contents = getAllBoxItems(box);
    
    contents.forEach(item => {
      if (item.status !== STATUS.IN_TRUCK && item.status !== STATUS.NOT_NEEDED) {
        updateItemStatus(item, STATUS.IN_TRUCK);
      }
    });
    
    // Mettre à jour le statut de la box elle-même
    updateBoxStatusFromContents(box);
    
    showToast('Tous les éléments ont été marqués comme dans le camion');
  };
  
  // Naviguer vers la section contenant la box
  const navigateToBox = (boxId) => {
    // Trouver la section et sous-section contenant la box
    let foundSectionKey = null;
    
    // Parcourir toutes les sections pour trouver la box
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.isBox && item.boxId === boxId) {
            foundSectionKey = sectionKey;
          }
        });
      });
    });
    
    // Ouvrir la section trouvée
    if (foundSectionKey && !openSections.value.includes(foundSectionKey)) {
      toggleSection(foundSectionKey);
    }
  };
  
  // Nettoyage à la destruction du composant
  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick);
  });
  </script>