<!-- src/components/inventory/boxes/BoxExpandedView.vue -->
<template>
  <!-- Status summary and progress -->
      <div class="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
        <div class="flex justify-between items-center mb-2">
          <div class="font-medium">
        {{ getBoxCompletedCount(box) }}/{{ getBoxItemCount(box) }} éléments vérifiés
          </div>
          <div>
        {{ getBoxCompletionPercentage(box) }}%
          </div>
        </div>

        <!-- Add this near the box status display in BoxExpandedView.vue -->
        <div class="flex items-center">
        <span 
            class="px-2 py-1 rounded-md text-sm text-white"
            :class="getStatusClass(box.status)"
        >
            {{ getStatusLabel(box.status) }}
        </span>
        </div>
        
    <!-- Box group actions -->
        <div class="flex flex-wrap gap-2">
          <button 
            @click.stop="$emit('mark-all-present', box.boxId)" 
            class="px-2 py-1 bg-status-present text-white rounded-md text-xs"
          >
            Tout marquer présent
          </button>
        </div>
      </div>
      
  <!-- Box content sections -->
      <BoxContentSections 
        :contents="box.contents"
        :activeStatusDropdown="activeStatusDropdown"
        :getStatusClass="getStatusClass"
        :getStatusLabel="getStatusLabel"
        :statusOptions="statusOptions"
        @mark-present="$emit('mark-present', $event)"
        @open-note="$emit('open-note', $event)"
        @toggle-status="$emit('toggle-status', $event)"
        @update-status="$emit('update-status', $event)"
        @save="$emit('save')"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
  </template>
  
  <script setup>
  import BoxContentSections from './BoxContentSections.vue';
  import { useBoxCalculations } from '../../../composables/useBoxCalculations';
  
  const props = defineProps({
    box: Object,
    activeStatusDropdown: Object,
    getStatusClass: Function,
    getStatusLabel: Function, // Add this
    statusOptions: Object
  });
  
// Get box calculation functions from composable
const { getBoxCompletedCount, getBoxItemCount, getBoxCompletionPercentage } = useBoxCalculations();

// Explicitly declare all emits
defineEmits([
  'mark-all-present',
  'mark-present',
  'open-note',
  'toggle-status',
  'update-status',
  'save',
  'toggle-expand'
]);
</script>