<!-- src/components/inventory/items/ItemControls.vue -->
<template>
    <div class="flex items-center space-x-2">
      <!-- Bouton pour marquer comme présent -->
      <button 
        v-if="showPresenceButton"
        @click.stop="$emit('mark-present', item)"
        class="p-1 bg-status-present text-white rounded-md text-sm"
        :disabled="isPresent"
        :class="{'opacity-50': isPresent}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
      
      <!-- Bouton pour marquer comme dans le camion -->
      <button 
        @click.stop="$emit('update-status', item, 'in-truck')" 
        class="p-1 bg-status-in-truck text-white rounded-md text-sm"
        :disabled="isInTruck"
        :class="{'opacity-50': isInTruck}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      </button>
      
      <!-- Bouton pour ouvrir la modale de note -->
      <button 
        @click.stop="$emit('open-note', item)"
        class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        title="Ajouter une note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      
      <!-- Menu de statut -->
      <div class="relative">
        <button 
          @click.stop="$emit('toggle-status', item)"
          class="p-1 rounded-md"
          :class="statusClass"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        
        <!-- Dropdown du menu de statut -->
        <StatusDropdown 
          v-if="isActive"
          :item="item"
          :statusOptions="statusOptions"
          :getStatusClass="getStatusClass"
          @update-status="(status) => $emit('update-status', item, status)"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useBoxManagement } from '../../../composables/useBoxManagement';
  import StatusDropdown from './StatusDropdown.vue';
  
  const props = defineProps({
    item: Object,
    activeStatusDropdown: Object,
    getStatusClass: Function,
    statusOptions: Object
  });
  
  const { hasBoxContents } = useBoxManagement();
  
  const isActive = computed(() => props.activeStatusDropdown === props.item);
  const isPresent = computed(() => props.item.status === 'present');
  const isInTruck = computed(() => props.item.status === 'in-truck');
  
  const showPresenceButton = computed(() => 
    !props.item.isBox || (props.item.isBox && !hasBoxContents(props.item))
  );
  
  const statusClass = computed(() => 
    props.item.status 
      ? props.getStatusClass(props.item.status) 
      : 'bg-gray-200 dark:bg-gray-700'
  );
  </script>