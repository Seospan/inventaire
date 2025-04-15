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
        <h3 class="text-lg font-medium mb-2">Progression du chargement</h3>
        <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            class="bg-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
            :style="`width: ${loadingProgress}%`"
            :aria-valuenow="loadingProgress"
            aria-valuemin="0"
            aria-valuemax="100"
            role="progressbar"
          ></div>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ loadingProgress }}% chargé ({{ inTruckCount }} / {{ totalItems }})
        </div>
      </div>
      
      <!-- Truck Loading Content -->
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
  const { inventory, STATUS, showToast } = useInventory();
  const { exportData, importData, clearData } = useStorage();
  
  // Stats for loading progress
  const totalItems = ref(0);
  const inTruckCount = ref(0);
  
  // Calculate loading progress
  const loadingProgress = computed(() => {
    if (totalItems.value === 0) return 0;
    return Math.round((inTruckCount.value / totalItems.value) * 100);
  });
  
  // Count items for progress tracking
  const updateCounts = () => {
    let total = 0;
    let inTruck = 0;
    
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
            }
          }
        });
      });
    });
    
    totalItems.value = total;
    inTruckCount.value = inTruck;
  };
  
  // Methods for import/export (duplicated from InventoryManager for this view)
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
      
      // Validate data structure (you'd need to import these from your utils)
      // if (!validateInventoryData(data)) {
      //   throw new Error('Format de données invalide');
      // }
      
      // Prepare data (you'd need to import these from your utils)
      // const preparedData = prepareInventoryData(data);
      
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
    // This would need to import from your utils
    // Simplified version for now
    clearData();
    showToast('Inventaire réinitialisé');
    // You'd need to update inventory.value here
    updateCounts();
  };
  
  // Watch for changes to update counts
  watch(inventory, () => {
    updateCounts();
  }, { deep: true });
  
  onMounted(() => {
    updateCounts();
  });
  </script>