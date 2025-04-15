<!-- src/components/inventory/boxes/BoxCollapsedView.vue -->
<template>
    <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
      <span>{{ itemCount }} élément(s) dans cette box</span>
      <button 
        @click.stop="$emit('toggle')"
        class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 underline"
      >
        Voir le détail
      </button>
    </div>
    <div class="flex flex-wrap gap-1 mt-1">
      <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-status-present text-white">
        {{ completedCount }}/{{ itemCount }} vérifiés
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useBoxManagement } from '../../../composables/useBoxManagement';
  
  const props = defineProps({
    box: Object
  });
  
  const { getBoxItemCount, getBoxCompletedCount } = useBoxManagement();
  
  const itemCount = computed(() => getBoxItemCount(props.box));
  const completedCount = computed(() => getBoxCompletedCount(props.box));
  </script>