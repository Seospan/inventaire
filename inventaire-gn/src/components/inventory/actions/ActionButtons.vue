<!-- src/components/inventory/actions/ActionButtons.vue -->
<template>
    <div class="fixed bottom-4 left-4 flex flex-col space-y-2">
      <ImportButton @import="$emit('import', $event)" />
      <ExportButton @click="$emit('export')" />
      <ResetButton @click="$emit('reset')" />
    </div>
  </template>