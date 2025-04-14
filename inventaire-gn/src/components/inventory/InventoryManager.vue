<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useInventory } from '../../composables/useInventory';
import { useStorage } from '../../composables/useStorage';
import { prepareInventoryData, validateInventoryData } from '../../utils/initData';
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
  getStatusLabel, getStatusClass, checkSectionCompletion,
  filteredItems, metrics, findBoxContents, updateBoxStatusFromContents
} = useInventory();

const { exportData, importData, clearData } = useStorage();

// États pour la modal de box
const boxModalActive = ref(false);
const currentBoxId = ref('');
const currentBoxName = ref('');
const currentBoxContents = ref([]);
const toastType = ref('info');

// Box-related methods
const showBoxContents = (boxId, boxName, contents) => {
  currentBoxId.value = boxId;
  currentBoxName.value = boxName;
  currentBoxContents.value = contents;
  boxModalActive.value = true;
  updateBoxStatusFromContents(boxId);
};

const closeBoxModal = () => {
  boxModalActive.value = false;
};

const updateBoxItemStatus = (item, status) => {
  updateItemStatus(item, status);
  if (currentBoxId.value) {
    const updatedContents = findBoxContents(currentBoxId.value);
    currentBoxContents.value = updatedContents;
    updateBoxStatusFromContents(currentBoxId.value);
  }
};

const markAllBoxItemsPresent = (boxId) => {
  const contents = findBoxContents(boxId);
  contents.forEach(item => {
    if (item.status !== STATUS.PRESENT && item.status !== STATUS.NOT_NEEDED) {
      updateItemStatus(item, STATUS.PRESENT);
    }
  });
  currentBoxContents.value = findBoxContents(boxId);
  updateBoxStatusFromContents(boxId);
  showToast('Tous les éléments ont été marqués comme présents');
};

const markAllBoxItemsInTruck = (boxId) => {
  const contents = findBoxContents(boxId);
  contents.forEach(item => {
    if (item.status !== STATUS.IN_TRUCK && item.status !== STATUS.NOT_NEEDED) {
      updateItemStatus(item, STATUS.IN_TRUCK);
    }
  });
  currentBoxContents.value = findBoxContents(boxId);
  updateBoxStatusFromContents(boxId);
  showToast('Tous les éléments ont été marqués comme dans le camion');
};

const navigateToBox = (boxId) => {
  let foundSectionKey = null;
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
  if (foundSectionKey && !openSections.value.includes(foundSectionKey)) {
    toggleSection(foundSectionKey);
  }
};

// Toast functionality
const showToast = (message, type = 'info', duration = 3000) => {
  toastMessage.value = message;
  toastType.value = type;
  toastActive.value = true;
  setTimeout(() => {
    toastActive.value = false;
  }, duration);
};

// Other methods (your existing methods)
const toggleSection = (sectionKey) => {
  const index = openSections.value.indexOf(sectionKey);
  if (index === -1) {
    openSections.value.push(sectionKey);
  } else {
    openSections.value.splice(index, 1);
  }
  if (index === -1) {
    checkSectionCompletion(sectionKey);
  }
};

// ... (rest of your existing methods)

onMounted(async () => {
  await loadInventory();
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<template>
  <!-- Your existing template -->
</template>