<!-- src/components/inventory/items/ItemHeader.vue -->
<template>
    <div class="flex-grow mr-2 flex items-center">
      <!-- Icône d'expansion pour les box -->
      <button 
        v-if="isBoxWithContents"
        @click.stop="$emit('toggle-expand', item.boxId)"
        class="mr-2 text-blue-500 dark:text-blue-400 focus:outline-none"
      >
        <svg 
          :class="[expanded ? 'transform rotate-90' : '', 'w-4 h-4 transition-transform']"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <!-- Icône de box pour les box -->
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
          <span v-if="item.boxId && !item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-sm cursor-pointer" @click.stop="$emit('navigate-to-parent', item.boxId)">
            Dans: {{ boxName }}
          </span>
        </div>
        
        <!-- Barre de progression pour les box -->
        <div v-if="isBoxWithContents" class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div 
            class="bg-status-present h-1.5 rounded-full" 
            :style="{ width: completionPercentage + '%' }"
          ></div>
        </div>
        
        <!-- Gestion des quantités -->
        <div v-if="hasQuantity" class="mt-1 flex items-center">
          <label class="text-sm mr-2">Quantité:</label>
          <input 
            v-model="quantity" 
            type="number" 
            min="0"
            class="w-16 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            @change="$emit('save')"
          />
          
          <span v-if="item.targetQuantity" class="ml-1 text-sm">
            / {{ item.targetQuantity }}
            <span v-if="item.isMinimumQuantity" class="text-xs">(min)</span>
          </span>
        </div>
        
        <!-- Affichage des notes -->
        <div v-if="item.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
          {{ item.note }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import { useBoxManagement } from '../../../composables/useBoxManagement';
  
  const props = defineProps({
    item: Object,
    expanded: Boolean,
    getBoxName: Function,
    getBoxCompletionPercentage: Function
  });
  
  const emit = defineEmits(['toggle-expand', 'navigate-to-parent', 'save']);
  
  const { hasBoxContents } = useBoxManagement();
  
  const quantity = ref(props.item.currentQuantity);
  
  const isBoxWithContents = computed(() => 
    props.item.isBox && hasBoxContents(props.item)
  );
  
  const hasQuantity = computed(() => 
    props.item.targetQuantity || props.item.variableQuantity
  );
  
  const boxName = computed(() => 
    props.item.boxId ? props.getBoxName(props.item.boxId) : ''
  );
  
  const completionPercentage = computed(() => 
    isBoxWithContents.value ? props.getBoxCompletionPercentage(props.item) : 0
  );
  </script>