<!-- src/components/inventory/boxes/BoxContentItem.vue -->
<template>
    <div class="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
      <div class="flex flex-wrap items-start justify-between">
        <!-- Item content -->
        <ItemHeader 
          :item="item"
          v-bind="$props"
        />
        
        <!-- Item controls -->
        <ItemControls
          :item="item"
          v-bind="$props"
          v-on="$listeners"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import ItemHeader from '../items/ItemHeader.vue';
  import ItemControls from '../items/ItemControls.vue';
  
  const props = defineProps({
    item: Object
  });
  </script>