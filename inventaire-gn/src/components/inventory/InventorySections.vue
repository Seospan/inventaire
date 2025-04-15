<!-- src/components/inventory/sections/InventorySections.vue -->
<template>
  <div>
    <SectionItem
      v-for="(section, sectionKey) in inventory"
      :key="sectionKey"
      :section="section"
      :sectionKey="sectionKey"
      v-bind="$props"
      v-on="$listeners"
    />
  </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
import SectionItem from './SectionItem.vue';
  
  const props = defineProps({
    inventory: Object,
    openSections: Array,
    activeStatusDropdown: Object,
    getStatusLabel: Function,
    getStatusClass: Function
  });
  
  const emit = defineEmits([
    'toggle-section', 
    'toggle-status', 
    'update-status', 
    'mark-present', 
    'open-note',
    'save',
    'mark-all-present',
    'mark-all-in-truck',
    'navigate-to-box'
  ]);
  
  // État pour les box développées
  const expandedBoxes = ref([]);
  
  // Vérifier si une section est ouverte
  const isOpen = (sectionKey) => {
    return props.openSections.includes(sectionKey);
  };
  
  // Ouvrir/fermer une section
  const toggleSection = (sectionKey) => {
    emit('toggle-section', sectionKey);
  };
  
  // Développer/réduire une box
  const toggleBoxExpand = (boxId) => {
    const index = expandedBoxes.value.indexOf(boxId);
    if (index === -1) {
      expandedBoxes.value.push(boxId);
    } else {
      expandedBoxes.value.splice(index, 1);
    }
  };
  
  // Naviguer vers la box parente
  const navigateToParentBox = (boxId) => {
    emit('navigate-to-box', boxId);
  };
  
  // Calcul du pourcentage de complétion d'une section
  const getSectionProgress = (sectionKey) => {
    const section = props.inventory[sectionKey];
    if (!section) return 0;
    
    let total = 0;
    let completed = 0;
    
    Object.keys(section.subsections || {}).forEach(subsectionKey => {
      const subsection = section.subsections[subsectionKey];
      
      (subsection.items || []).forEach(item => {
        if (item.status !== 'not-needed') {
          total++;
          if (item.status === 'present' || item.status === 'in-truck') {
            completed++;
          }
          
          // Count box contents too
          if (item.isBox && item.contents) {
            Object.keys(item.contents).forEach(contentSubsectionKey => {
              const contentSubsection = item.contents[contentSubsectionKey];
              (contentSubsection.items || []).forEach(contentItem => {
                if (contentItem.status !== 'not-needed') {
                  total++;
                  if (contentItem.status === 'present' || contentItem.status === 'in-truck') {
                    completed++;
                  }
                }
              });
            });
          }
        }
      });
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  // Options de statut pour le menu déroulant
  const statusOptions = computed(() => {
    return {
      'null': props.getStatusLabel(null),
      'present': props.getStatusLabel('present'),
      'to-find': props.getStatusLabel('to-find'),
      'to-buy': props.getStatusLabel('to-buy'),
      'to-repair': props.getStatusLabel('to-repair'),
      'not-needed': props.getStatusLabel('not-needed'),
      'in-truck': props.getStatusLabel('in-truck')
    };
  });
  
  // Récupérer le nom d'une box à partir de son ID
  const getBoxName = (boxId) => {
    let foundName = '';
    let boxFound = false;
    
    // Parcourir toutes les sections et sous-sections pour trouver la box
    Object.keys(props.inventory).forEach(sectionKey => {
      const section = props.inventory[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.isBox && item.boxId === boxId) {
            foundName = item.name;
            boxFound = true;
          }
        });
      });
    });
    
    return boxFound ? foundName : boxId;
  };
  
  // Vérifier si une box a des éléments
const hasBoxContents = (box) => {
  if (!box || !box.contents) return false;
  
  let hasItems = false;
  
  Object.keys(box.contents).forEach(subsectionKey => {
    const subsection = box.contents[subsectionKey];
    if (subsection.items && subsection.items.length > 0) {
      hasItems = true;
    }
  });

  return hasItems;
};

// Obtenir tous les éléments contenus dans une box
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

// Compter le nombre d'éléments dans une box
const getBoxItemCount = (box) => {
  return getAllBoxItems(box).length;
};

// Compter le nombre d'éléments vérifiés dans une box (présent ou dans le camion)
const getBoxCompletedCount = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  return items.filter(item => 
    item.status === 'present' || 
    item.status === 'in-truck' || 
    item.status === 'not-needed'
  ).length;
};

// Calculer le pourcentage de complétion d'une box
const getBoxCompletionPercentage = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  const completed = getBoxCompletedCount(box);
  return Math.round((completed / items.length) * 100);
};

// Obtenir la liste des statuts présents dans une box
const getBoxContentStatuses = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return [];
  
  const statuses = new Set();
  
  items.forEach(item => {
    statuses.add(item.status);
  });
  
  return Array.from(statuses);
};

// Compter le nombre d'éléments avec un statut spécifique dans une box
const getBoxContentStatusCount = (box, status) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  return items.filter(item => item.status === status).length;
};

// Calculer le nombre d'éléments par statut dans une box
const getBoxContentStatusCounts = (box) => {
  const counts = {
    'null': 0,
    'present': 0,
    'to-find': 0,
    'to-buy': 0,
    'to-repair': 0,
    'not-needed': 0,
    'in-truck': 0
  };
  
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return counts;
  
  items.forEach(item => {
    const status = item.status === null ? 'null' : item.status;
    counts[status] = (counts[status] || 0) + 1;
  });
  
  return counts;
};
</script>