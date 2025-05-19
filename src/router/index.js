import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes = [
  {
    path: '/',
    redirect: '/InfoList'
  },
  {
    path: '/Scan',
    component: () => import('../view/Scan.vue')
  },
  {
    path: '/Info/:id',
    component: () => import('../view/Info.vue')
  },
  {
    path: '/InfoList',
    component: () => import('../view/InfoList.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
