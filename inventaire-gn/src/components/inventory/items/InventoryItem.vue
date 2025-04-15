<!-- src/components/inventory/items/InventoryItem.vue -->
<template>
    <div class="p-2 border rounded-md" :class="itemClasses">
      <ItemHeader :item="item" />
      <ItemControls 
        :item="item"
        v-bind="$props"
        v-on="$listeners"
      />
      <BoxContent 
        v-if="item.isBox"
        :box="item"
        v-bind="$props"
        v-on="$listeners"
      />
    </div>
  </template>