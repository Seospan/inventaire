<!-- src/components/ui/BoxContentsModal.vue -->
<template>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="active" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="absolute inset-0 bg-black opacity-50" @click="close"></div>
          <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg z-10 p-6 m-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">
                Contenu de : {{ boxName }}
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ contents.length }} élément(s)
                </div>
              </h3>
              <button @click="close" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Résumé du statut -->
            <div class="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <div class="font-medium mb-2">Statut des éléments</div>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="(count, status) in getStatusCounts()" :key="status" class="flex items-center">
                  <div 
                    class="w-3 h-3 rounded-full mr-2" 
                    :class="getStatusClass(status === 'null' ? null : status)"
                  ></div>
                  <span>{{ getStatusLabel(status === 'null' ? null : status) }}: {{ count }}</span>
                </div>
              </div>
            </div>
            
            <!-- Bouton pour marquer tous les éléments comme présents -->
            <div class="mb-4 flex justify-between">
              <button 
                @click="markAllAsPresent" 
                class="px-3 py-1 bg-status-present text-white rounded-md text-sm mr-2"
              >
                Tout marquer comme présent
              </button>
            </div>
            
            <div class="space-y-3">
              <div v-if="contents.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                Aucun élément trouvé dans cette box.
              </div>
              
              <div 
                v-for="(item, index) in contents" 
                :key="index" 
                class="p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                :class="{'bg-gray-50 dark:bg-gray-800': item.isBox}"
              >
                <div class="font-medium mb-1">{{ item.name }}</div>
                
                <!-- Status -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center text-sm">
                    <div 
                      class="w-3 h-3 rounded-full mr-2" 
                      :class="getStatusClass(item.status)"
                    ></div>
                    <span>{{ getStatusLabel(item.status) }}</span>
                  </div>
                  
                  <div class="flex space-x-1">
                    <button 
                      @click="updateStatus(item, 'present')" 
                      class="px-2 py-0.5 bg-status-present text-white rounded-md text-xs"
                      :class="{'opacity-50': item.status === 'present'}"
                      :disabled="item.status === 'present'"
                    >
                      Présent
                    </button>
                    <button 
                      @click="updateStatus(item, 'in-truck')" 
                      class="px-2 py-0.5 bg-status-in-truck text-white rounded-md text-xs"
                      :class="{'opacity-50': item.status === 'in-truck'}"
                      :disabled="item.status === 'in-truck'"
                    >
                      En camion
                    </button>
                  </div>
                </div>
                
                <!-- Quantité -->
                <div v-if="item.targetQuantity || item.variableQuantity" class="text-sm mb-1">
                  Quantité: {{ item.currentQuantity || '?' }}
                  <span v-if="item.targetQuantity"> / {{ item.targetQuantity }}</span>
                  <span v-if="item.isMinimumQuantity" class="text-xs">(min)</span>
                </div>
                
                <!-- Note -->
                <div v-if="item.note" class="text-sm italic text-gray-500 dark:text-gray-400">
                  {{ item.note }}
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end">
              <button 
                @click="navigateToBox" 
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
              >
                Voir la section
              </button>
              <button 
                @click="close" 
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  const props = defineProps({
    active: Boolean,
    boxId: String,
    boxName: String,
    contents: Array,
    getStatusLabel: Function,
    getStatusClass: Function
  });
  
  const emit = defineEmits(['close', 'navigate-to-box', 'update-status', 'mark-all-present', 'mark-all-in-truck']);
  
  const close = () => {
    emit('close');
  };
  
  const navigateToBox = () => {
    emit('navigate-to-box', props.boxId);
    close();
  };
  
  const updateStatus = (item, status) => {
    emit('update-status', item, status);
  };
  
  const markAllAsPresent = () => {
    emit('mark-all-present', props.boxId);
  };
  
  const markAllAsInTruck = () => {
    emit('mark-all-in-truck', props.boxId);
  };
  
  // Calculer le nombre d'éléments par statut
  const getStatusCounts = () => {
    const counts = {
      'null': 0,
      'present': 0,
      'to-find': 0,
      'to-buy': 0,
      'to-repair': 0,
      'not-needed': 0,
      'in-truck': 0
    };
    
    if (!props.contents) return counts;
    
    props.contents.forEach(item => {
      const status = item.status === null ? 'null' : item.status;
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  };
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  </style>