<!-- src/components/inventory/sections/SubSectionList.vue -->
<template>
  <div v-for="(subsection, subsectionKey) in subsections" :key="subsectionKey" class="mb-4">
    <SubsectionHeader :title="subsection.title" />
    
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
        @update-status="$emit('update-status', $event)"
        @toggle-status="$emit('toggle-status', $event)"
        @open-note="$emit('open-note', $event)"
        @save="$emit('save')"
        @toggle-expand="$emit('toggle-expand', $event)"
        @navigate-to-parent="$emit('navigate-to-box', $event)"
        @mark-all-present="$emit('mark-all-present', $event)"
        @mark-all-in-truck="$emit('mark-all-in-truck', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import InventoryItem from '../items/InventoryItem.vue';
import SubsectionHeader from './SubsectionHeader.vue';

defineProps({
  subsections: Object,
  expandedBoxes: Array,
  activeStatusDropdown: Object,
  getStatusLabel: Function,
  getStatusClass: Function,
  statusOptions: Object,
  getBoxName: Function,
  hasBoxContents: Function,
  getBoxCompletionPercentage: Function,
  getBoxItemCount: Function,
  getBoxCompletedCount: Function
});

defineEmits([
  'mark-present',
  'update-status',
  'toggle-status',
  'open-note',
  'save',
  'toggle-expand',
  'navigate-to-box',
  'mark-all-present',
  'mark-all-in-truck'
]);
</script>