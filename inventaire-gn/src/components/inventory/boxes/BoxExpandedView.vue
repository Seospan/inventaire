<!-- src/components/inventory/boxes/BoxExpandedView.vue -->
<template>
    <div>
      <!-- Résumé des statuts et barre de progression -->
      <div class="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
        <div class="flex justify-between items-center mb-2">
          <div class="font-medium">
            {{ completedCount }}/{{ itemCount }} éléments vérifiés
          </div>
          <div>
            {{ completionPercentage }}%
          </div>
        </div>
        
        <!-- Actions de groupe pour la box -->
        <div class="flex flex-wrap gap-2">
          <button 
            @click.stop="$emit('mark-all-present', box.boxId)" 
            class="px-2 py-1 bg-status-present text-white rounded-md text-xs"
          >
            Tout marquer présent
          </button>
        </div>
      </div>
      
      <!-- Content sections -->
      <BoxContentSections 
        :contents="box.contents"
        v-bind="$props"
        v-on="$listeners"
      />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useBoxManagement } from '../../../composables/useBoxManagement';
  import BoxContentSections from './BoxContentSections.vue';
  
  const props = defineProps({
    box: Object
  });
  
  const { getBoxItemCount, getBoxCompletedCount, getBoxCompletionPercentage } = useBoxManagement();
  
  const itemCount = computed(() => getBoxItemCount(props.box));
  const completedCount = computed(() => getBoxCompletedCount(props.box));
  const completionPercentage = computed(() => getBoxCompletionPercentage(props.box));
  </script>