<template>
    <div class="progress-container">
      <div>Progression des éléments présents</div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${overallProgress}%` }">{{ overallProgress }}%</div>
      </div>
      <div class="counters">
        <div class="counter to-find">
          <span class="counter-value">{{ toFindCount }}</span>
          <span class="counter-label">À trouver</span>
        </div>
        <div class="counter to-buy">
          <span class="counter-value">{{ toBuyCount }}</span>
          <span class="counter-label">À acheter</span>
        </div>
        <div class="counter to-repair">
          <span class="counter-value">{{ toRepairCount }}</span>
          <span class="counter-label">À réparer</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProgressSection',
    props: {
      overallProgress: {
        type: Number,
        required: true
      },
      toFindCount: {
        type: Number,
        required: true
      },
      toBuyCount: {
        type: Number,
        required: true
      },
      toRepairCount: {
        type: Number,
        required: true
      }
    }
  }
  </script>