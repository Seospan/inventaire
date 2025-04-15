<!-- src/components/inventory/InventoryManager.vue -->
<template>
  <div>
    <!-- Barre de progression -->
    <ProgressSection 
      :progress="metrics.progress"
      :presentCount="metrics.present"
      :toFindCount="metrics.toFind"
      :toBuyCount="metrics.toBuy"
      :toRepairCount="metrics.toRepair"
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
      :hideInTruck="true"
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
      :expandedBoxes="expandedBoxes"
      @toggle-section="toggleSection"
      @toggle-status="toggleStatusDropdown"
      @update-status="updateItemStatus"
      @mark-present="markItemPresent"
      @open-note="openNoteModal"
      @save="saveInventory"
      @mark-all-present="markAllBoxItemsPresent"
      @mark-all-in-truck="markAllBoxItemsInTruck"
      @navigate-to-box="navigateToBox"
      @toggle-expand="toggleBoxExpand"
    />
    
    <!-- Modales -->
    <NoteModal 
      :active="noteModalActive"
      :note="currentNote"
      :title="currentItem ? currentItem.name : ''"
      @close="closeNoteModal"
      @save="saveNote"
    />
    
    <CelebrationModal :active="celebrationActive" />
    
    <BoxContentsModal 
      v-if="useModalForBoxContents"
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
    />
    
    <!-- Notifications Toast -->
    <Toast :active="toastActive" :message="toastMessage" :type="toastType" />
    
    <!-- Actions globales -->
    <div class="fixed bottom-4 left-4 z-50">
      <ActionButtons 
        @import="handleImportClick"
        @export="exportInventory"
        @reset="resetInventory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useInventory } from '../../composables/useInventory';
import { useStorage } from '../../composables/useStorage';
import { useBoxManagement } from '../../composables/useBoxManagement';
import { prepareInventoryData, validateInventoryData } from '../../utils/initData';

import ActionButtons from './actions/ActionButtons.vue';

// Components
import ProgressSection from './ProgressSection.vue';
import StatusFilter from './StatusFilter.vue';
import FilteredView from './FilteredView.vue';
import InventorySections from './sections/InventorySections.vue'; // Changed from SectionsList
import NoteModal from '../ui/NoteModal.vue';
import CelebrationModal from '../ui/CelebrationModal.vue';
import BoxContentsModal from '../ui/BoxContentsModal.vue';
import Toast from '../ui/Toast.vue';

// État pour le type de toast
const toastType = ref('info');

// États pour la modal de box
const boxModalActive = ref(false);
const currentBoxId = ref('');
const currentBoxName = ref('');
const currentBoxContents = ref([]);

// Feature flag for using modal vs inline box contents
const useModalForBoxContents = ref(false);

// Récupération des composables
const { 
  inventory, isLoading, openSections, activeStatusDropdown,
  noteModalActive, currentNote, currentItem, celebrationActive,
  toastActive, toastMessage, currentFilter, STATUS,
  loadInventory, saveInventory, updateItemStatus, updateItemNote,
  getStatusLabel, getStatusClass, showToast, checkSectionCompletion,
  filteredItems, metrics, updateBoxStatusFromContents, 
  findBoxContents
} = useInventory();

const { exportData, importData, clearData } = useStorage();
const { expandedBoxes, toggleBoxExpand, getAllBoxItems } = useBoxManagement();

// Chargement des données au démarrage
onMounted(async () => {
  await loadInventory();
  document.addEventListener('click', handleDocumentClick);
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

// Box-related methods
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

const updateBoxItemStatus = (item, status) => {
  // If trying to mark as IN_TRUCK, redirect to truck loading page
  if (status === STATUS.IN_TRUCK) {
    showToast('Pour charger dans le camion, utilisez la page dédiée', 'info');
    return;
  }

  updateItemStatus(item, status);
  
  if (currentBoxId.value) {
    const updatedContents = findBoxContents(currentBoxId.value);
    currentBoxContents.value = updatedContents;
    updateBoxStatusFromContents(currentBoxId.value);
  }
};

const markAllBoxItemsPresent = (boxId) => {
  const box = getBoxById(boxId);
  if (!box) return;
  
  const contents = getAllBoxItems(box);
  
  contents.forEach(item => {
    if (item.status !== STATUS.PRESENT && item.status !== STATUS.NOT_NEEDED && item.status !== STATUS.IN_TRUCK) {
      updateItemStatus(item, STATUS.PRESENT);
    }
  });
  
  if (useModalForBoxContents.value && boxModalActive.value) {
    currentBoxContents.value = findBoxContents(boxId);
  }
  
  updateBoxStatusFromContents(boxId);
  showToast('Tous les éléments ont été marqués comme présents');
};

const navigateToBox = (boxId) => {
  let foundSectionKey = null;
  
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
  
  if (foundSectionKey && !openSections.value.includes(foundSectionKey)) {
    toggleSection(foundSectionKey);
  }
  
  // Si on utilise la modal, on la ferme
  if (boxModalActive.value) {
    closeBoxModal();
  }
  
  // Expand the box in the UI
  if (!expandedBoxes.value.includes(boxId)) {
    toggleBoxExpand(boxId);
  }
};

const showBoxContents = (boxId, boxName, contents) => {
  if (useModalForBoxContents.value) {
    currentBoxId.value = boxId;
    currentBoxName.value = boxName;
    currentBoxContents.value = contents;
    boxModalActive.value = true;
  } else {
    // Use inline box display - toggle the box expanded state
    if (!expandedBoxes.value.includes(boxId)) {
      toggleBoxExpand(boxId);
    }
  }
  
  updateBoxStatusFromContents(boxId);
};

const closeBoxModal = () => {
  boxModalActive.value = false;
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
    activeStatusDropdown.value = null;
  }
};

// Réinitialisation de l'inventaire
const resetInventory = () => {
  console.log('Reset inventory method called');
  // Supprimer les données du localStorage
  clearData();
  
  // Réinitialiser l'inventaire avec les données vides
  import('../../utils/initData').then(module => {
    inventory.value = module.getDefaultInventoryData();
    saveInventory();
    showToast('Inventaire réinitialisé');
  });
};

// Add this method to your script setup section
//const fileInputRef = ref(null);

const handleImportClick = () => {
  // Create a temporary file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (event) => importInventory(event);
  
  // Trigger the file dialog
  input.click();
};

// Nettoyage à la destruction du composant
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>