<!-- src/components/inventory/actions/ImportButton.vue -->
<template>
    <label class="btn btn-primary flex items-center cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
      </svg>
      <span>Importer</span>
      <input type="file" class="hidden" @change="$emit('import', $event)" accept=".json">
    </label>
  </template>