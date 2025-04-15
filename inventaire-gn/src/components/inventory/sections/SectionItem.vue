<!-- src/components/inventory/sections/SectionItem.vue -->
<template>
    <div class="card mb-4">
      <SectionHeader 
        :section="section"
        :sectionKey="sectionKey"
        :progress="getSectionProgress(sectionKey)"
        @toggle="toggleSection"
      />
      <SubsectionList 
        v-if="isOpen(sectionKey)"
        :subsections="section.subsections"
        v-bind="$props"
        v-on="$listeners"
      />
    </div>
  </template>