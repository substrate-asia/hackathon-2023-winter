<template>
  <div class="player-pokers">
    <el-card shadow="hover" :body-style="{ padding: '0px' }" class="player-card" v-for="(poker, index) in hands"
      :key="poker.id" :style="{ left: index * 20 + 'px' }" :class="{ 'is-selected': poker.isSelected }">
      <img :src="`/src/images/${poker.img}.png`" class="image" :style="{ width: '120px', height: 'auto' }"
        @click="selectCard(poker)" />
    </el-card>
  </div>
</template>
  
<script setup lang ="ts">
import type { PokerCard } from '../constant/poker';

const props = defineProps({
  hands: {
    type: Array as () => PokerCard[],
    require: true
  }
});
const selectCard = (poker: PokerCard) => {
  poker.isSelected = !poker.isSelected
}
</script>
  
<style scoped>
.player-pokers {
  height: 31.5vh;
  position: absolute;
  left: 50%;
  bottom: 0.5vw;
  transform: translate(-50%, 0);
  display: flex;
  width: calc(16 * 20px + 120px);

  .player-card {
    position: absolute;
  }

  .player-card.is-selected {
    top: -2vw;
  }
}
</style>
  