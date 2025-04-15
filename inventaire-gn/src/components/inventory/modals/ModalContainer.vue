<!-- src/components/inventory/modals/ModalContainer.vue -->
<template>
    <div>
      <NoteModal v-bind="noteModal" v-on="$listeners" />
      <CelebrationModal :active="celebrationActive" />
      <BoxContentsModal v-bind="boxModal" v-on="$listeners" />
      <Toast v-bind="toast" />
    </div>
  </template>