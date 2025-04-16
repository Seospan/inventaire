<!-- src/components/inventory/sections/SectionHeader.vue -->
<template>
    <div 
      @click="$emit('toggle')"
      class="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
    >
      <h2 class="text-lg font-medium">{{ title }}</h2>
      <div class="flex items-center space-x-2">
        <!-- Completion indicator -->
        <div v-if="progress === 100" class="text-status-present">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Progress percentage -->
        <div class="text-sm">
          {{ progress }}%
        </div>
        
        <!-- Expansion arrow -->
        <svg 
          class="h-5 w-5 transform transition-transform" 
          :class="isOpen ? 'rotate-180' : ''" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    progress: Number,
    isOpen: Boolean
  });
  
  defineEmits(['toggle']);
  </script>