<!-- src/components/inventory/sections/SubsectionList.vue -->
<template>
    <div class="mt-2 pl-2">
      <div v-for="(subsection, key) in subsections" :key="key">
        <SubsectionHeader :title="subsection.title" />
        <ItemList 
          :items="subsection.items"
          v-bind="$props"
          v-on="$listeners"
        />
      </div>
    </div>
  </template>