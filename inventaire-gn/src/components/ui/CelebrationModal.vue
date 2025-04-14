<template>
    <Teleport to="body">
      <Transition name="celebration">
        <div v-if="active" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div class="text-center p-8 rounded-lg">
            <div class="text-4xl mb-4">🎉</div>
            <h2 class="text-2xl font-bold text-white mb-2">Section Complète !</h2>
            <p class="text-white">Excellent travail, tout est vérifié !</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  defineProps({
    active: Boolean
  });
  </script>
  
  <style scoped>
  .celebration-enter-active,
  .celebration-leave-active {
    transition: opacity 0.5s, transform 0.5s;
  }
  
  .celebration-enter-from,
  .celebration-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
  
  /* Animation d'apparition */
  @keyframes confetti {
    0% { transform: translateY(0) rotate(0); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  </style>