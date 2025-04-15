<!-- src/views/TruckLoadingView.vue -->
<template>
    <div>
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">Chargement Camion</h2>
        
        <!-- Navigation button back to inventory page -->
        <router-link 
          to="/" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
        >
          Retour à l'Inventaire
        </router-link>
      </div>
      
      <!-- Truck Loading Progress -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-medium">Progression du chargement</h3>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ loadingProgress }}% complet
          </span>
        </div>
        
        <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            class="bg-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
            :style="`width: ${loadingProgress}%`"
            :aria-valuenow="loadingProgress"
            aria-valuemin="0"
            aria-valuemax="100"
            role="progressbar"
          ></div>
        </div>
        
        <div class="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span class="font-medium text-purple-600 dark:text-purple-400">{{ inTruckCount }}</span> 
            éléments chargés
          </div>
          <div>
            <span class="font-medium text-green-600 dark:text-green-400">{{ presentCount }}</span> 
            prêts à être chargés
          </div>
          <div>
            <span class="font-medium text-orange-600 dark:text-orange-400">{{ otherCount }}</span> 
            pas encore prêts
          </div>
        </div>
      </div>
      
      <!-- Loading tips -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Pour un chargement efficace, commencez par charger les éléments les plus grands et les plus lourds en premier.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Truck Loading Manager Component -->
      <TruckLoadingManager 
        @import="handleImportClick"
        @export="exportInventory" 
        @reset="resetInventory"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useInventory } from '../composables/useInventory';
  import { useStorage } from '../composables/useStorage';
  import TruckLoadingManager from '../components/inventory/TruckLoadingManager.vue';
  
  // Get inventory data
  const { inventory, STATUS, showToast, loadInventory } = useInventory();
  const { exportData, importData, clearData } = useStorage();
  
  // Stats for loading progress
  const totalItems = ref(0);
  const inTruckCount = ref(0);
  const presentCount = ref(0);
  const otherCount = ref(0);
  
  // Calculate loading progress
  const loadingProgress = computed(() => {
    if (totalItems.value === 0) return 0;
    return Math.round((inTruckCount.value / totalItems.value) * 100);
  });
  
  // Count items for progress tracking
  const updateCounts = () => {
    let total = 0;
    let inTruck = 0;
    let present = 0;
    let other = 0;
    
    // Iterate through inventory data structure to count items
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          // Only count items that need to be loaded (not NOT_NEEDED status)
          if (item.status !== STATUS.NOT_NEEDED) {
            total++;
            
            if (item.status === STATUS.IN_TRUCK) {
              inTruck++;
            } else if (item.status === STATUS.PRESENT) {
              present++;
            } else {
              other++;
            }
          }
        });
      });
    });
    
    totalItems.value = total;
    inTruckCount.value = inTruck;
    presentCount.value = present;
    otherCount.value = other;
  };
  
  // Methods for import/export
  const exportInventory = () => {
    if (Object.keys(inventory.value).length === 0) {
      showToast('Aucune donnée à exporter', 'warning');
      return;
    }
  
    const url = exportData();
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventaire-gn-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Exportation réussie');
    } else {
      showToast('Erreur lors de l\'exportation', 'error');
    }
  };
  
  const importInventory = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const data = await importData(file);
      
      // Update inventory
      inventory.value = data;
      
      showToast('Importation réussie');
      event.target.value = null; // Reset file input
      updateCounts(); // Update counts after import
    } catch (error) {
      showToast(`Erreur: ${error.message}`, 'error');
      event.target.value = null;
    }
  };
  
  const handleImportClick = () => {
    // Create a temporary file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => importInventory(event);
    
    // Trigger the file dialog
    input.click();
  };
  
  const resetInventory = () => {
    clearData();
    showToast('Inventaire réinitialisé');
    updateCounts();
  };
  
  // Watch for changes to update counts
  watch(inventory, () => {
    updateCounts();
  }, { deep: true });
  
  onMounted(async () => {
    console.log('TruckLoadingView mounted, loading inventory...');
    // First load the inventory
    await loadInventory();
    console.log('Inventory loaded:', inventory.value);
    
    // Then update counts
    updateCounts();
  });
  </script>