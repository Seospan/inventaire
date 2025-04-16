<!-- src/components/inventory/items/ItemQuantity.vue -->
<template>
    <div class="mt-1 flex items-center">
      <label class="text-sm mr-2">Quantité:</label>
      <input 
        v-model="item.currentQuantity" 
        type="number" 
        min="0"
        class="w-16 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        @change="$emit('save')"
      />
      
      <span v-if="item.targetQuantity" class="ml-1 text-sm">
        / {{ item.targetQuantity }}
        <span v-if="item.isMinimumQuantity" class="text-xs">(min)</span>
      </span>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    item: Object
  });
  
  const emit = defineEmits(['save']);
  </script>