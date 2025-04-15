<!-- src/components/inventory/boxes/BoxContentSections.vue -->
<template>
    <div>
      <div v-for="(subsection, key) in contents" :key="key" class="mb-3">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1">
          {{ subsection.title }}
        </h4>
        
        <!-- Liste des éléments dans la sous-section -->
        <div class="space-y-2 pl-2">
          <BoxContentItem 
            v-for="(item, index) in subsection.items" 
            :key="index" 
            :item="item"
            v-bind="$props"
            v-on="$listeners"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import BoxContentItem from './BoxContentItem.vue';
  
  const props = defineProps({
    contents: Object
  });
  </script>