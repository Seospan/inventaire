<!-- src/components/inventory/items/StatusDropdown.vue -->
<template>
    <div class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
      <div class="py-1">
        <button 
          v-for="(label, status) in statusOptions" 
          :key="status" 
          @click.stop="$emit('update-status', status === 'null' ? null : status)"
          class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          :class="{'font-medium': item.status === (status === 'null' ? null : status)}"
        >
          <span 
            class="w-3 h-3 rounded-full mr-2" 
            :class="getStatusClass(status === 'null' ? null : status)"
          ></span>
          {{ label }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    item: {
      type: Object,
      required: true
    },
    statusOptions: {
      type: Object,
      required: true
    },
    getStatusClass: {
      type: Function,
      required: true
    }
  });
  
  defineEmits(['update-status']);
  </script>