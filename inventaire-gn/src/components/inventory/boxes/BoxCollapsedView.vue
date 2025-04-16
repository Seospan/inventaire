<!-- src/components/inventory/boxes/BoxCollapsedView.vue -->
<template>
    <div class="flex flex-wrap gap-1 mt-1">
      <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-status-present text-white">
        {{ getBoxCompletedCount(box) }}/{{ getBoxItemCount(box) }} vérifiés
      </span>
    </div>
  </template>
  
  <script setup>
  import { useBoxCalculations } from '../../../composables/useBoxCalculations';

  const props = defineProps({
    box: Object,
  });

  const { getBoxCompletedCount, getBoxItemCount } = useBoxCalculations();

  defineEmits(['toggle']);
  </script>