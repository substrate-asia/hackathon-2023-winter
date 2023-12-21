import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/pokergame',
      name: 'PokerGame',
      component: () => import('../components/PokerGame.vue')
    },
    {
      path: '/',
      name: 'CreateGame',
      component: () => import('../components/CreateGame.vue')
    }
  ]
})

export default router
