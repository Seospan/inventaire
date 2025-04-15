<!-- src/components/inventory/sections/InventorySections.vue -->
<template>
  <div>
    <div v-for="(section, sectionKey) in inventory" :key="sectionKey" class="card mb-4">
      <!-- Section header -->
      <div 
        @click="toggleSection(sectionKey)"
        class="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <h2 class="text-lg font-medium">{{ section.title }}</h2>
        <div class="flex items-center space-x-2">
          <!-- Completion indicator -->
          <div v-if="getSectionProgress(sectionKey) === 100" class="text-status-present">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Progress percentage -->
          <div class="text-sm">
            {{ getSectionProgress(sectionKey) }}%
          </div>
          
          <!-- Expansion arrow -->
          <svg 
            class="h-5 w-5 transform transition-transform" 
            :class="isOpen(sectionKey) ? 'rotate-180' : ''" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <!-- Section content -->
      <div v-if="isOpen(sectionKey)" class="mt-2 pl-2">
        <div v-for="(subsection, subsectionKey) in section.subsections" :key="subsectionKey" class="mb-4">
          <!-- Subsection header -->
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
            {{ subsection.title }}
          </h3>
          
          <!-- Items list -->
          <div class="space-y-2">
            <InventoryItem 
              v-for="(item, itemIndex) in subsection.items" 
              :key="itemIndex" 
              :item="item"
              :expandedBoxes="expandedBoxes"
              :activeStatusDropdown="activeStatusDropdown"
              :getStatusLabel="getStatusLabel"
              :getStatusClass="getStatusClass"
              :statusOptions="statusOptions"
              :getBoxName="getBoxName"
              :hasBoxContents="hasBoxContents"
              :getBoxCompletionPercentage="getBoxCompletionPercentage"
              :getBoxItemCount="getBoxItemCount"
              :getBoxCompletedCount="getBoxCompletedCount"
              @mark-present="$emit('mark-present', $event)"
              @update-status="$emit('update-status', $event[0], $event[1])"
              @toggle-status="$emit('toggle-status', $event)"
              @open-note="$emit('open-note', $event)"
              @save="$emit('save')"
              @toggle-expand="toggleBoxExpand"
              @navigate-to-parent="$emit('navigate-to-box', $event)"
              @mark-all-present="$emit('mark-all-present', $event)"
              @mark-all-in-truck="$emit('mark-all-in-truck', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InventoryItem from '../items/InventoryItem.vue';

const props = defineProps({
  inventory: Object,
  openSections: Array,
  activeStatusDropdown: Object,
  getStatusLabel: Function,
  getStatusClass: Function,
  expandedBoxes: Array
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
  'navigate-to-box',
  'toggle-expand'
]);

// Check if a section is open
const isOpen = (sectionKey) => {
  return props.openSections.includes(sectionKey);
};

// Toggle section expansion
const toggleSection = (sectionKey) => {
  emit('toggle-section', sectionKey);
};

// Toggle box expansion
const toggleBoxExpand = (boxId) => {
  emit('toggle-expand', boxId);
};

// Calculate section completion percentage
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

// Status options for dropdown menu
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

// Get box name by ID
const getBoxName = (boxId) => {
  let foundName = '';
  let boxFound = false;
  
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

// Check if a box has contents
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

// Get all items in a box
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

// Count items in a box
const getBoxItemCount = (box) => {
  return getAllBoxItems(box).length;
};

// Count completed items in a box
const getBoxCompletedCount = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  return items.filter(item => 
    item.status === 'present' || 
    item.status === 'in-truck' || 
    item.status === 'not-needed'
  ).length;
};

// Calculate box completion percentage
const getBoxCompletionPercentage = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  const completed = getBoxCompletedCount(box);
  return Math.round((completed / items.length) * 100);
};
</script>