import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
     component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/marcas',
      name: 'marcas',
      component: () => import('../views/Marcas/index.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/Marcas/Edit.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Marcas/Create.vue')
    },
    {
      path: '/tenis',
      name: 'tenis',
      component: () => import('../views/Tenis/index.vue')
    }
    ,
    {
      path: '/graphic',
      name: 'graphic',
      component: () => import('../views/Tenis/Graphic.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/Tenis/Reports.vue')
    }
  
    
  ]
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();
  if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return '/login';
  }
});


export default router
