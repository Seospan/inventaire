<!-- src/components/inventory/sections/SubsectionHeader.vue -->
<template>
    <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
      {{ title }}
    </h3>
  </template>
  
  <script setup>
  const props = defineProps({
    title: String
  });
  </script>