<template>
    <div v-if="currentFilter !== 'all'" class="card mb-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">
          {{ filterTitle }}
          <span class="text-sm font-normal ml-1">({{ filteredItems.length }} élément(s))</span>
        </h2>
        <button 
          @click="$emit('reset-filter')" 
          class="text-sm text-blue-500 hover:underline"
        >
          Revenir à la vue complète
        </button>
      </div>
      
      <div class="space-y-2">
        <div v-for="(item, index) in filteredItems" :key="index" class="p-2 border border-gray-200 dark:border-gray-700 rounded-md">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ item.sectionTitle }} › {{ item.subsectionTitle }}
              </div>
              <div class="font-medium">
                {{ item.name }}
                <span v-if="item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm">
                  Box
                </span>
              </div>
              
              <div v-if="item.targetQuantity" class="text-sm">
                Quantité: {{ item.currentQuantity || '?' }} / {{ item.targetQuantity }}
                <span v-if="item.isMinimumQuantity" class="text-xs">(min)</span>
              </div>
              
              <div v-if="item.variableQuantity" class="text-sm">
                Quantité variable: {{ item.currentQuantity || '?' }}
              </div>
              
              <div v-if="item.note" class="text-sm italic text-gray-500 dark:text-gray-400 mt-1">
                {{ item.note }}
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button 
                v-if="currentFilter === 'null'"
                @click="$emit('mark-item', item, 'present')"
                class="px-2 py-1 bg-status-present text-white rounded-md text-sm"
              >
                OK
              </button>
              
              <button 
                @click="$emit('change-status', item)"
                class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              >
                Changer
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredItems.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
          Aucun élément trouvé avec ce statut.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    filteredItems: Array,
    currentFilter: String,
    getStatusLabel: Function
  });
  
  const emit = defineEmits(['reset-filter', 'mark-item', 'change-status']);
  
  // Titre en fonction du filtre actif
  const filterTitle = computed(() => {
    return props.getStatusLabel(props.currentFilter === 'null' ? null : props.currentFilter);
  });
  </script>