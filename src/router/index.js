import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import QuestionnaireView from '../views/QuestionnaireView.vue'
import ArchivesView from '../views/ArchivesView.vue'
import TexteView from '../views/TexteView.vue'
import FaqView from '../views/FaqView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/quiz', name: 'quiz', component: QuestionnaireView },
    { path: '/archives', component: ArchivesView },
    { path: '/texte', component: TexteView },
    { path: '/faq', component: FaqView },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Si l'utilisateur fait "Précédent", on le laisse là où il était
    if (savedPosition) {
      return savedPosition
    } else {
      // Sinon, on remonte en haut (x: 0, y: 0)
      return { top: 0 }
    }
  },
})

export default router