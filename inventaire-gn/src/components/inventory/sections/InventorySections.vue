<!-- src/components/inventory/sections/InventorySections.vue -->
<template>
  <div>
    <div v-for="(section, sectionKey) in inventory" :key="sectionKey" class="card mb-4">
      <!-- Section header component -->
      <SectionHeader 
        :title="section.title"
        :progress="getSectionProgress(sectionKey)"
        :isOpen="isOpen(sectionKey)"
        @toggle="toggleSection(sectionKey)"
      />
      
      <!-- Section content -->
      <div v-if="isOpen(sectionKey)" class="mt-2 pl-2">
        <SubSectionList 
          :subsections="section.subsections"
          :expandedBoxes="expandedBoxes"
          :activeStatusDropdown="activeStatusDropdown"
          :getStatusLabel="getStatusLabel"
          :getStatusClass="getStatusClass"
          :statusOptions="statusOptions"
          :getBoxName="getBoxName"
          @mark-present="$emit('mark-present', $event)"
          @update-status="$emit('update-status', $event[0], $event[1])"
          @toggle-status="$emit('toggle-status', $event)"
          @open-note="$emit('open-note', $event)"
          @save="$emit('save')"
          @toggle-expand="toggleBoxExpand"
          @navigate-to-box="$emit('navigate-to-box', $event)"
          @mark-all-present="$emit('mark-all-present', $event)"
          @mark-all-in-truck="$emit('mark-all-in-truck', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBoxCalculations } from '../../../composables/useBoxCalculations';
import { useBoxManagement } from '../../../composables/useBoxManagement';
import SectionHeader from './SectionHeader.vue';
import SubSectionList from './SubSectionList.vue';

const props = defineProps({
  inventory: Object,
  openSections: Array,
  activeStatusDropdown: Object,
  getStatusLabel: Function,
  getStatusClass: Function,
  expandedBoxes: Array
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

// Add statusOptions computed property here if not already present
const statusOptions = computed(() => ({
  'null': props.getStatusLabel(null),
  'present': props.getStatusLabel('present'),
  'to-find': props.getStatusLabel('to-find'),
  'to-buy': props.getStatusLabel('to-buy'),
  'to-repair': props.getStatusLabel('to-repair'),
  'not-needed': props.getStatusLabel('not-needed'),
  'in-truck': props.getStatusLabel('in-truck')
}));

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

// Use composable for section progress calculation
const { getSectionProgress } = useBoxCalculations(props.inventory);
</script>