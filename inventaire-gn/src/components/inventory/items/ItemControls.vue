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