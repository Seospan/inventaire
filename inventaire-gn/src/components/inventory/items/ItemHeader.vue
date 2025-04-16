<!-- src/components/inventory/items/ItemHeader.vue -->
<template>
    <div class="flex-grow mr-2 flex items-center">
    <!-- Expansion icon for boxes -->
      <button 
      v-if="item.isBox && hasBoxContents(item)"
      @click.stop="$emit('toggle-expand')"
        class="mr-2 text-blue-500 dark:text-blue-400 focus:outline-none"
      >
        <svg 
        :class="['w-4 h-4 transition-transform']"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
    <!-- Box icon for boxes -->
      <div v-if="item.isBox" class="mr-2 text-blue-500 dark:text-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 14h4" />
        </svg>
      </div>
      
      <div>
        <div class="font-medium">
          {{ item.name }}
          <span v-if="item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm">
            Box
          </span>
        <span
          v-if="item.boxId && !item.isBox"
          class="ml-1 text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-sm cursor-pointer"
          @click.stop="$emit('navigate-to-parent', item.boxId)"
        >
          Dans: {{ getBoxName(item.boxId) }}
          </span>
        </div>
        
      <!-- Progress bar for boxes -->
      <div v-if="item.isBox && hasBoxContents(item)" class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <div
          class="bg-status-present h-1.5 rounded-full"
          :style="{ width: getBoxCompletionPercentage(item) + '%' }"
        ></div>
    </div>

      <!-- Quantity management -->
      <ItemQuantity
        v-if="item.targetQuantity || item.variableQuantity"
        :item="item"
        @save="$emit('save')"
        />

      <!-- Notes display -->
      <div v-if="item.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
        {{ item.note }}
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
import { useBoxManagement } from '../../../composables/useBoxManagement';
import { useBoxCalculations } from '../../../composables/useBoxCalculations';
import ItemQuantity from './ItemQuantity.vue';

  const props = defineProps({
    item: Object,
    getBoxName: Function
  });
  
const { hasBoxContents } = useBoxManagement();
const { getBoxCompletionPercentage } = useBoxCalculations();

const emit = defineEmits([
  'toggle-expand',
  'navigate-to-parent',
  'save'
]);
  </script>