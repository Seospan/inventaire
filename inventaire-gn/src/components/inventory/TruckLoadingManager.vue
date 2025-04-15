<!-- src/components/inventory/TruckLoadingManager.vue -->
<template>
    <div>
      <!-- Simple Tab Navigation -->
      <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex -mb-px">
          <button 
            @click="activeTab = 'to-load'"
            class="py-2 px-4 text-center border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'to-load' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            À charger ({{ toLoadCount }})
          </button>
          
          <button 
            @click="activeTab = 'loaded'"
            class="py-2 px-4 text-center border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'loaded' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            Chargés ({{ loadedCount }})
          </button>
        </div>
      </div>
      
      <!-- Search & Filter Bar -->
      <div class="mb-4 flex items-center justify-between">
        <div class="relative flex-grow max-w-md">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher un élément..." 
            class="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div class="ml-4">
          <select 
            v-model="sortBy" 
            class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 px-3"
          >
            <option value="name">Nom</option>
            <option value="path">Emplacement</option>
          </select>
        </div>
      </div>
      
      <!-- Item List -->
      <div class="space-y-2">
        <template v-if="filteredItems.length">
          <div 
            v-for="(item, index) in filteredItems" 
            :key="index"
            class="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div class="flex items-center">
              <!-- Box icon for box items -->
              <svg v-if="item.isBox" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              
              <!-- Regular item icon -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              
              <div>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ item.path || 'Élément principal' }}
                </div>
                <div v-if="item.note" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ truncateNote(item.note) }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <!-- Action buttons based on current tab and item status -->
              <button 
                v-if="activeTab === 'to-load' && item.status !== STATUS.IN_TRUCK"
                @click="markAsLoaded(item)" 
                class="ml-2 p-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                title="Marquer comme chargé"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button 
                v-if="activeTab === 'loaded'"
                @click="markAsUnloaded(item)" 
                class="ml-2 p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                title="Retirer du camion"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button 
                @click="openNoteModal(item)" 
                class="ml-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Voir les notes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </template>
        
        <!-- Empty state -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">
            <span v-if="activeTab === 'to-load'">Tous les éléments sont chargés dans le camion!</span>
            <span v-else-if="activeTab === 'loaded'">Aucun élément n'est encore chargé dans le camion.</span>
          </p>
        </div>
      </div>
      
      <!-- Note Modal -->
      <div 
        v-if="noteModalActive" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeNoteModal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-medium mb-2">{{ selectedItem ? selectedItem.name : '' }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {{ selectedItem && selectedItem.note ? selectedItem.note : 'Aucune note disponible.' }}
          </p>
          <div class="flex justify-end">
            <button 
              @click="closeNoteModal" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
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
    updateItemStatus, getStatusLabel, getStatusClass, showToast,
    loadInventory, saveInventory
  } = useInventory();
  
  // State
  const activeTab = ref('to-load'); // 'to-load' or 'loaded'
  const searchQuery = ref('');
  const sortBy = ref('name');
  const noteModalActive = ref(false);
  const selectedItem = ref(null);
  
  // Extract all items from inventory structure, including those in boxes
  const allItems = computed(() => {
    const items = [];
    
    // Helper function to process items from a box
    const processBoxContents = (box, path) => {
      if (!box.contents) return;
      
      // Iterate through box contents sections
      Object.keys(box.contents).forEach(sectionKey => {
        const section = box.contents[sectionKey];
        const sectionPath = path ? `${path} > ${section.title || sectionKey}` : section.title || sectionKey;
        
        // Process items in this section
        (section.items || []).forEach(item => {
          if (item.status !== STATUS.NOT_NEEDED) {
            // Add path information to the item
            // (don't create a new object with spread operator)
            item.path = sectionPath;
            items.push(item);
            
            // If this is a nested box, process its contents too
            if (item.isBox && item.contents) {
              processBoxContents(item, sectionPath);
            }
          }
        });
      });
    };
    
    // Start with top-level sections
    Object.keys(inventory.value).forEach(sectionKey => {
      const section = inventory.value[sectionKey];
      
      // Process subsections
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        const path = `${section.title} > ${subsection.title}`;
        
        // Process items in this subsection
        (subsection.items || []).forEach(item => {
          if (item.status !== STATUS.NOT_NEEDED) {
            // Add path information directly to the original item
            item.path = path;
            items.push(item);
            
            // If it's a box, process its contents
            if (item.isBox && item.contents) {
              processBoxContents(item, path);
            }
          }
        });
      });
    });
    
    console.log(`Found ${items.length} items in inventory`);
    return items;
  });
  
  // Items to be loaded (present items)
  const itemsToLoad = computed(() => 
    allItems.value.filter(item => item.status === STATUS.PRESENT)
  );
  
  // Items already loaded (in truck)
  const itemsLoaded = computed(() => 
    allItems.value.filter(item => item.status === STATUS.IN_TRUCK)
  );
  
  // Count for tabs
  const toLoadCount = computed(() => itemsToLoad.value.length);
  const loadedCount = computed(() => itemsLoaded.value.length);
  
  // Filtered and sorted items based on active tab, search query, and sort option
  const filteredItems = computed(() => {
    let items = [];
    
    // Filter by tab
    if (activeTab.value === 'to-load') {
      items = itemsToLoad.value;
    } else if (activeTab.value === 'loaded') {
      items = itemsLoaded.value;
    }
    
    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.note && item.note.toLowerCase().includes(query)) ||
        (item.path && item.path.toLowerCase().includes(query))
      );
    }
    
    // Sort items
    return items.sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy.value === 'path') {
        return (a.path || '').localeCompare(b.path || '');
      }
      return 0;
    });
  });
  
  // Methods
  const markAsLoaded = (item) => {
    console.log('Marking item as loaded:', item);
    
    // Update the status directly
    item.status = STATUS.IN_TRUCK;
    item.inTruck = true;
    
    // Call the composable method to handle any side effects and saving
    updateItemStatus(item, STATUS.IN_TRUCK);
    
    // Ensure the inventory is saved
    saveInventory();
    
    showToast(`${item.name} a été chargé dans le camion`, 'success');

    // Force update to active tab
    //activeTab.value = 'loaded';
    
    // Force the tabs to update
    setTimeout(() => {
        console.log('Items to load:', itemsToLoad.value.length);
        console.log('Items loaded:', itemsLoaded.value.length);
    }, 100);
  };
  
  const markAsUnloaded = (item) => {
    console.log('Marking item as unloaded:', item);
  
    // Update the status directly
    item.status = STATUS.PRESENT;
    item.inTruck = false;
    
    // Call the composable method to handle any side effects and saving
    updateItemStatus(item, STATUS.PRESENT);
    
    // Ensure the inventory is saved
    saveInventory();
    
    showToast(`${item.name} a été retiré du camion`, 'info');
    
    // Force update to active tab
    //activeTab.value = 'to-load';

    // Force the tabs to update
    setTimeout(() => {
        console.log('Items to load:', itemsToLoad.value.length);
        console.log('Items loaded:', itemsLoaded.value.length);
    }, 100);
  };
  
  const openNoteModal = (item) => {
    selectedItem.value = item;
    noteModalActive.value = true;
  };
  
  const closeNoteModal = () => {
    noteModalActive.value = false;
    selectedItem.value = null;
  };
  
  const truncateNote = (note) => {
    if (!note) return '';
    return note.length > 30 ? note.substring(0, 30) + '...' : note;
  };
  
  // Close modal when pressing escape
  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      closeNoteModal();
    }
  };

  // Find the original item in the inventory structure
    const findOriginalItem = (item) => {
    // First check if this is a top-level item
    let foundItem = null;
    
    Object.keys(inventory.value).forEach(sectionKey => {
        const section = inventory.value[sectionKey];
        
        Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(originalItem => {
            // Match by name (and possibly other identifiers)
            if (originalItem.name === item.name && 
                originalItem.status === item.status && 
                (originalItem.isBox === item.isBox)) {
            foundItem = originalItem;
            }
            
            // If it's a box, also look in its contents
            if (originalItem.isBox && originalItem.contents && !foundItem) {
            Object.keys(originalItem.contents).forEach(contentKey => {
                const content = originalItem.contents[contentKey];
                (content.items || []).forEach(boxItem => {
                if (boxItem.name === item.name && 
                    boxItem.status === item.status) {
                    foundItem = boxItem;
                }
                });
            });
            }
        });
        });
    });
    
    return foundItem;
    };
  
  onMounted(async () => {
    document.addEventListener('keydown', handleEscKey);
    
    // Load inventory data when the component mounts
    await loadInventory();
    console.log('Inventory loaded in TruckLoadingManager');
    console.log('Inventory structure:', Object.keys(inventory.value));
    console.log('All items:', allItems.value.length);
  });
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey);
  });
  </script>