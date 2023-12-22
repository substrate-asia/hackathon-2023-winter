<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import FirstPage from './components/FirstPage.vue'

export default {
  name: 'app',
  components: {
    FirstPage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
