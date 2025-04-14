<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 pb-20">
    <header class="bg-white dark:bg-gray-800 shadow py-4 sticky top-0 z-10">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Inventaire GN</h1>
        <ThemeToggle :isDark="isDark" @toggle="toggleTheme" />
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-6">
      <div v-if="isLoading" class="flex flex-col justify-center items-center py-12">
        <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-lg">Chargement de l'inventaire...</span>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Préparation des données pour l'application</p>
      </div>
      
      <InventoryManager v-if="!isLoading" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTheme } from './composables/useTheme';
import ThemeToggle from './components/ui/ThemeToggle.vue';
import InventoryManager from './components/inventory/InventoryManager.vue';
import { useStorage } from './composables/useStorage';

// Gestion du thème
const { isDark, toggleTheme } = useTheme();

// État de chargement
const isLoading = ref(true);

// Chargement du JSON
onMounted(async () => {
  // Si aucune donnée n'est trouvée dans le localStorage, 
  // chargez le fichier JSON directement si nécessaire
  const { loadData, saveData } = useStorage();
  
  let data = loadData();
  
  if (!data) {
    try {
      // Importation du fichier JSON statique
      // Cette approche fonctionne avec Vite
      const defaultData = await import('../matos_updated.json');
      saveData(defaultData.default);
    } catch (error) {
      console.error("Erreur lors du chargement du fichier JSON", error);
    }
  }
  
  isLoading.value = false;
});
</script>