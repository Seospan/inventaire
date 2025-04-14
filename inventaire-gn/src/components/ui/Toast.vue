<template>
    <Transition name="toast">
      <div v-if="active" 
           class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
           :class="typeClass"
           role="alert">
        <div v-if="type === 'warning'" class="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div v-else-if="type === 'error'" class="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div v-else-if="type === 'success'" class="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {{ message }}
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    active: Boolean,
    message: String,
    type: {
      type: String,
      default: 'info',
      validator: (val) => ['info', 'success', 'warning', 'error'].includes(val)
    }
  });
  
  const typeClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
      default:
        return 'bg-gray-800 dark:bg-gray-700 text-white';
    }
  });
  </script>
  
  <style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: transform 0.3s, opacity 0.3s;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
  </style>