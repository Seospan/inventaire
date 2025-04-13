<template>
    <div :class="['toast-notification', { active }]">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'Toast',
    props: {
      active: {
        type: Boolean,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  }
  </script>