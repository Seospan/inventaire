<!-- src/components/inventory/TruckLoadingManager.vue -->
<template>
    <div>
      <!-- Status filters for truck loading -->
      <div class="card mb-4">
        <div class="flex overflow-x-auto pb-2 -mx-2 px-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="setCurrentFilter(filter.value)"
            class="px-3 py-1 rounded-full text-sm whitespace-nowrap mr-2 flex items-center transition-colors"
            :class="currentFilter === filter.value ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'"
          >
            <span class="w-2 h-2 rounded-full mr-1" :class="filter.class"></span>
            {{ filter.label }}
            <span v-if="filter.count" class="ml-1 px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded-full">
              {{ filter.count }}
            </span>
          </button>
        </div>
      </div>
      
      <!-- Items list -->
      <div v-if="filteredItems.length > 0" class="space-y-4">
        <div 
          v-for="(item, index) in filteredItems" 
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-medium">{{ item.name }}</h3>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Status: 
                <span 
                  class="px-2 py-0.5 rounded-full text-xs font-medium" 
                  :class="getStatusClass(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>
              <p v-if="item.note" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Note: {{ item.note }}
              </p>
            </div>
            
            <div class="flex space-x-2">
              <!-- Load in truck button (for items not yet in truck) -->
              <button 
                v-if="item.status !== STATUS.IN_TRUCK && item.status !== STATUS.NOT_NEEDED"
                @click="updateItemStatus(item, STATUS.IN_TRUCK)"
                class="px-3 py-1 rounded-md text-white text-sm font-medium bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Charger
              </button>
              
              <!-- Unload button (for items in truck) -->
              <button 
                v-if="item.status === STATUS.IN_TRUCK"
                @click="updateItemStatus(item, STATUS.PRESENT)"
                class="px-3 py-1 rounded-md text-white text-sm font-medium bg-green-600 hover:bg-green-700 transition-colors"
              >
                Décharger
              </button>
              
              <!-- Status dropdown button -->
              <div class="relative">
                <button 
                  @click="toggleStatusDropdown(item)"
                  class="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                <!-- Status dropdown -->
                <div 
                  v-if="activeStatusDropdown === item"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
                >
                  <div class="py-1">
                    <button 
                      v-for="status in Object.values(STATUS)" 
                      :key="status"
                      v-show="status !== null && status !== item.status"
                      @click="updateItemStatus(item, status)"
                      class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {{ getStatusLabel(status) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">
          <span v-if="currentFilter === 'all'">Aucun élément à afficher.</span>
          <span v-else-if="currentFilter === 'present'">Aucun élément présent à charger.</span>
          <span v-else-if="currentFilter === 'in-truck'">Aucun élément dans le camion.</span>
          <span v-else>Aucun élément correspond au filtre sélectionné.</span>
        </p>
      </div>
      
      <!-- Toast for notifications -->
      <Toast :active="toastActive" :message="toastMessage" :type="toastType" />
      
      <!-- Action buttons -->
      <div class="fixed bottom-4 left-4 z-50">
        <ActionButtons 
          @import="$emit('import')"
          @export="$emit('export')"
          @reset="$emit('reset')"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useInventory } from '../../composables/useInventory';
  import ActionButtons from './actions/ActionButtons.vue';
  import Toast from '../ui/Toast.vue';
  
  // Emits
  const emit = defineEmits(['import', 'export', 'reset']);
  
  // Get inventory composable
  const { 
    inventory, STATUS, toastActive, toastMessage, toastType,
    updateItemStatus, getStatusLabel, getStatusClass, showToast
  } = useInventory();
  
  // State
  const currentFilter = ref('all');
  const activeStatusDropdown = ref(null);
  
  // Extract all items from inventory structure
  const allItems = computed(() => {
    const items = [];
    
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.status !== STATUS.NOT_NEEDED) {
            items.push(item);
          }
        });
      });
    });
    
    return items;
  });
  
  // Computed counts
  const presentCount = computed(() => 
    allItems.value.filter(item => item.status === STATUS.PRESENT).length
  );
  
  const inTruckCount = computed(() => 
    allItems.value.filter(item => item.status === STATUS.IN_TRUCK).length
  );
  
  const otherCount = computed(() => 
    allItems.value.filter(item => 
      item.status !== STATUS.PRESENT && 
      item.status !== STATUS.IN_TRUCK && 
      item.status !== STATUS.NOT_NEEDED
    ).length
  );
  
  // Filters for the filter bar
  const filters = computed(() => [
    {
      label: 'Tous',
      value: 'all',
      class: 'bg-gray-400',
      count: allItems.value.length
    },
    {
      label: 'À charger',
      value: 'present',
      class: 'bg-status-present',
      count: presentCount.value
    },
    {
      label: 'Dans le camion',
      value: 'in-truck',
      class: 'bg-status-in-truck',
      count: inTruckCount.value
    },
    {
      label: 'Pas prêt',
      value: 'other',
      class: 'bg-status-to-find',
      count: otherCount.value
    }
  ]);
  
  // Filtered items based on current filter
  const filteredItems = computed(() => {
    if (currentFilter.value === 'all') {
      return allItems.value;
    } else if (currentFilter.value === 'present') {
      return allItems.value.filter(item => item.status === STATUS.PRESENT);
    } else if (currentFilter.value === 'in-truck') {
      return allItems.value.filter(item => item.status === STATUS.IN_TRUCK);
    } else if (currentFilter.value === 'other') {
      return allItems.value.filter(item => 
        item.status !== STATUS.PRESENT && 
        item.status !== STATUS.IN_TRUCK && 
        item.status !== STATUS.NOT_NEEDED
      );
    }
    return [];
  });
  
  // Methods
  const setCurrentFilter = (filter) => {
    currentFilter.value = filter;
    activeStatusDropdown.value = null; // Close any open dropdowns
  };
  
  const toggleStatusDropdown = (item) => {
    activeStatusDropdown.value = activeStatusDropdown.value === item ? null : item;
  };
  
  // Close dropdown when clicking outside
  const handleDocumentClick = (event) => {
    if (activeStatusDropdown.value) {
      activeStatusDropdown.value = null;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick);
  });
  </script>