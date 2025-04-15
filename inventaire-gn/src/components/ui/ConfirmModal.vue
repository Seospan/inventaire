<!-- src/components/ui/ConfirmModal.vue -->
<template>
    <div v-if="active" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 dark:bg-black/70" 
        @click="$emit('cancel')"
      ></div>
      
      <!-- Modal Content -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-auto relative z-10 shadow-lg">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
        
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ message }}
        </p>
        
        <div class="mt-4 flex justify-end space-x-3">
          <button 
            @click="$emit('cancel')"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="$emit('confirm')"
            :class="confirmButtonClass"
            class="px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

  import { computed } from 'vue';

  const props = defineProps({
    active: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    type: {
      type: String,
      default: 'danger',
      validator: (value) => ['danger', 'warning', 'info', 'success'].includes(value)
    }
  });
  
  defineEmits(['confirm', 'cancel']);
  
  // Compute the confirm button class based on the type
  const confirmButtonClass = computed(() => {
    switch (props.type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'info':
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  });
  </script>