<!-- src/components/inventory/actions/ActionMenuItem.vue -->
<template>
    <button
      class="w-full px-4 py-3 text-left flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :class="[
        disabled 
          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
          : 'text-gray-700 dark:text-gray-200 cursor-pointer'
      ]"
      role="menuitem"
      tabindex="-1"
      @click="$emit('click')"
      :disabled="disabled"
    >
      <!-- Icon slot -->
      <span class="mr-3 text-gray-500 dark:text-gray-400">
        <slot name="icon"></slot>
      </span>
      
      <!-- Default content slot -->
      <span class="font-medium">
        <slot></slot>
      </span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    disabled: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['click']);
  </script>