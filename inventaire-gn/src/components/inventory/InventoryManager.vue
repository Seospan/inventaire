<template>
    <div>
      <!-- Barre de progression -->
      <ProgressSection 
        :progress="metrics.progress"
        :presentCount="metrics.present"
        :toFindCount="metrics.toFind"
        :toBuyCount="metrics.toBuy"
        :toRepairCount="metrics.toRepair"
        :inTruckCount="metrics.inTruck"
        :notNeededCount="metrics.notNeeded"
        :boxCount="metrics.boxCount"
        :boxContentCount="metrics.boxContentCount"
      />
      
      <!-- Filtres par statut -->
      <StatusFilter 
        :currentFilter="currentFilter"
        :toFindCount="metrics.toFind"
        :toBuyCount="metrics.toBuy"
        :toRepairCount="metrics.toRepair"
        :notNeededCount="metrics.notNeeded"
        :inTruckCount="metrics.inTruck"
        :presentCount="metrics.present"
        :nullCount="metrics.total - (metrics.present + metrics.toFind + metrics.toBuy + metrics.toRepair + metrics.notNeeded + metrics.inTruck)"
        @change-filter="setCurrentFilter"
      />
      
      <!-- Vue filtrée par statut -->
      <FilteredView 
        v-if="currentFilter !== 'all'"
        :filteredItems="filteredItems"
        :currentFilter="currentFilter"
        :getStatusLabel="getStatusLabel"
        @reset-filter="resetFilter"
        @mark-item="updateItemStatus"
        @change-status="openStatusDropdown"
      />
      
      <!-- Vue principale des sections -->
      <InventorySections 
        v-if="currentFilter === 'all'"
        :inventory="inventory"
        :openSections="openSections"
        :activeStatusDropdown="activeStatusDropdown"
        :getStatusLabel="getStatusLabel"
        :getStatusClass="getStatusClass"
        @toggle-section="toggleSection"
        @toggle-status="toggleStatusDropdown"
        @update-status="updateItemStatus"
        @mark-present="markItemPresent"
        @open-note="openNoteModal"
        @save="saveInventory"
        @show-box-contents="showBoxContents"
      />
      
      <!-- Modal de note -->
      <NoteModal 
        :active="noteModalActive"
        :note="currentNote"
        :title="currentItem ? currentItem.name : ''"
        @close="closeNoteModal"
        @save="saveNote"
      />
      
      <!-- Modal de célébration -->
      <CelebrationModal :active="celebrationActive" />
      
      <!-- Modal de contenu de box -->
      <BoxContentsModal 
        :active="boxModalActive" 
        :boxId="currentBoxId"
        :boxName="currentBoxName"
        :contents="currentBoxContents"
        :getStatusLabel="getStatusLabel"
        :getStatusClass="getStatusClass"
        @close="closeBoxModal"
        @navigate-to-box="navigateToBox"
        @update-status="updateBoxItemStatus"
        @mark-all-present="markAllBoxItemsPresent"
        @mark-all-in-truck="markAllBoxItemsInTruck"
      />
      
      <!-- Notifications Toast -->
      <Toast :active="toastActive" :message="toastMessage" :type="toastType" />
      
      <!-- Actions globales -->
      <div class="fixed bottom-4 left-4 flex flex-col space-y-2">
        <!-- Bouton d'import -->
        <label class="btn btn-primary flex items-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          <span>Importer</span>
          <input type="file" class="hidden" @change="importInventory($event)" accept=".json">
        </label>
        
        <!-- Bouton d'export -->
        <button @click="exportInventory" class="btn btn-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Exporter</span>
        </button>
        
        <!-- Bouton de réinitialisation -->
        <button @click="resetInventory" class="btn bg-red-500 hover:bg-red-600 text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Réinitialiser</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useInventory } from '../../composables/useInventory';
  import { useStorage } from '../../composables/useStorage';
  import { prepareInventoryData, validateInventoryData } from '../../utils/initData';
  
  // États pour la modal de box
  const boxModalActive = ref(false);
  const currentBoxId = ref('');
  const currentBoxName = ref('');
  const currentBoxContents = ref([]);
  
  import ProgressSection from './ProgressSection.vue';
  import StatusFilter from './StatusFilter.vue';
  import FilteredView from './FilteredView.vue';
  import InventorySections from './InventorySections.vue';
  import NoteModal from '../ui/NoteModal.vue';
  import CelebrationModal from '../ui/CelebrationModal.vue';
  import BoxContentsModal from '../ui/BoxContentsModal.vue';
  import Toast from '../ui/Toast.vue';
  
  // Récupération des composables
  const { 
    inventory, isLoading, openSections, activeStatusDropdown,
    noteModalActive, currentNote, currentItem, celebrationActive,
    toastActive, toastMessage, currentFilter, STATUS,
    loadInventory, saveInventory, updateItemStatus, updateItemNote,
    getStatusLabel, getStatusClass, showToast, checkSectionCompletion,
    filteredItems, metrics, findBoxContents, updateBoxStatusFromContents
  } = useInventory();
  
  const { exportData, importData, clearData } = useStorage();
  
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
      // Ceci est une version simplifiée, vous pourriez avoir besoin d'une logique plus précise
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
  
  // Nettoyage à la destruction du composant
  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick);
  });
  
  // État pour le type de toast
  const toastType = ref('info');// Mettre à jour le statut d'un élément depuis la modal de box
  const updateBoxItemStatus = (item, status) => {
    updateItemStatus(item, status);
    
    // Rafraîchir la liste des éléments de la box
    if (currentBoxId.value) {
      const updatedContents = findBoxContents(currentBoxId.value);
      currentBoxContents.value = updatedContents;
      
      // Vérifier si la box elle-même devrait être mise à jour
      updateBoxStatusFromContents(currentBoxId.value);
    }
  };
  
  // Marquer tous les éléments d'une box comme présents
  const markAllBoxItemsPresent = (boxId) => {
    const contents = findBoxContents(boxId);
    
    contents.forEach(item => {
      if (item.status !== STATUS.PRESENT && item.status !== STATUS.NOT_NEEDED) {
        updateItemStatus(item, STATUS.PRESENT);
      }
    });
    
    // Rafraîchir la liste des éléments de la box
    currentBoxContents.value = findBoxContents(boxId);
    
    // Mettre à jour le statut de la box elle-même
    updateBoxStatusFromContents(boxId);
    
    showToast('Tous les éléments ont été marqués comme présents');
  };
  
  // Marquer tous les éléments d'une box comme dans le camion
  const markAllBoxItemsInTruck = (boxId) => {
    const contents = findBoxContents(boxId);
    
    contents.forEach(item => {
      if (item.status !== STATUS.IN_TRUCK && item.status !== STATUS.NOT_NEEDED) {
        updateItemStatus(item, STATUS.IN_TRUCK);
      }
    });
    
    // Rafraîchir la liste des éléments de la box
    currentBoxContents.value = findBoxContents(boxId);
    
    // Mettre à jour le statut de la box elle-même
    updateBoxStatusFromContents(boxId);
    
    showToast('Tous les éléments ont été marqués comme dans le camion');
  };// Ouvrir la modal de contenu de box
  const showBoxContents = (boxId, boxName, contents) => {
    currentBoxId.value = boxId;
    currentBoxName.value = boxName;
    currentBoxContents.value = contents;
    boxModalActive.value = true;
    
    // Vérifier si on a besoin de mettre à jour le statut de la box
    updateBoxStatusFromContents(boxId);
  };
  
  // Fermer la modal de contenu de box
  const closeBoxModal = () => {
    boxModalActive.value = false;
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
          if (item.boxId === boxId) {
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
  </script>