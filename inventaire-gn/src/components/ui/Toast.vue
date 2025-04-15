<!-- src/components/ui/Toast.vue -->
<template>
  <transition name="toast">
    <div
      v-if="active"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50"
      :class="typeClasses"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  active: Boolean,
  message: String,
  type: {
    type: String,
    default: 'info'
  }
});

const typeClasses = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    case 'success':
      return 'bg-green-500 text-white';
    default:
      return 'bg-blue-500 text-white';
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>