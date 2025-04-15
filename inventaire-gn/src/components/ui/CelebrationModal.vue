<!-- src/components/ui/CelebrationModal.vue -->
<template>
  <div v-if="active" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 p-6 text-center">
      <div class="text-4xl mb-4">🎉</div>
      <h3 class="text-xl font-medium mb-2">Section complétée !</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Excellent travail ! Cette section est maintenant terminée.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: Boolean
});
</script>