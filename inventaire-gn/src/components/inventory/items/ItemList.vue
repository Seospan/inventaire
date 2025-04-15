<!-- src/components/inventory/items/ItemList.vue -->
<template>
    <div class="space-y-2">
      <InventoryItem 
        v-for="(item, index) in items" 
        :key="index" 
        :item="item"
        v-bind="$props"
        v-on="$listeners"
      />
    </div>
  </template>
  
  <script setup>
  import InventoryItem from './InventoryItem.vue';
  
  const props = defineProps({
    items: Array
  });
  </script>