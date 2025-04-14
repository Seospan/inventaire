<template>
    <div :class="['celebration', { active }]">
      <h2>Section complétée !</h2>
      <p>Vous avez vérifié tous les éléments de cette section.</p>
      <button class="celebration-btn" @click="$emit('close')">Continuer</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CelebrationModal',
    props: {
      active: {
        type: Boolean,
        required: true
      }
    }
  }
  </script>