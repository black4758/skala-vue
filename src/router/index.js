// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    // 지연 로딩(Lazy Loading) 적용
    component: () => import('../views/WeatherHomeView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/WeatherAboutView.vue')
  },
  {
    // 동적 경로 매칭 (:cityId)
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue')
  },
 {
  // 기상 통계 요약 페이지
    path: '/stats',
    name: 'Stats',
    component: () => import('../views/WeatherStatsView.vue')
  },
  {
    // Catch-all Route: 정의되지 않은 모든 경로를 잡아냄
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router