import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/Editor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Editor',
      component: EditorView,
    },
  ],
})

export default router
