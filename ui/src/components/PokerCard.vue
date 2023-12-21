<template>
    <div class="poker-card" :class="{ 'is-expanded': isExpanded }" @click="toggleCard">
      {{ card }}
    </div>
  </template>
  
  <script setup lang ="ts">
  import { ref } from 'vue';
  
  const props = defineProps({
    card: String
  });
  const isExpanded = ref(false);
  
  const toggleCard = () => {
    isExpanded.value = !isExpanded.value;
  };
  </script>
  
  <style scoped>
  .poker-card {
    cursor: pointer;
    transition: transform 0.3s ease;
    /* 根据需要添加更多样式 */
  }
  .is-expanded {
    transform: scale(1.5);
  }
  </style>
  