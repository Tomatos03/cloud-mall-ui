// import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/home/index.vue'),
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('@/views/search/index.vue'),
        },
        {
            path: '/goods',
            name: 'Goods',
            component: () => import('@/views/goods/index.vue'),
        },
        {
            path: '/goods/:id',
            name: 'GoodsDetail',
            component: () => import('@/views/goods/index.vue'),
        },
        {
            path: '/address',
            name: 'Address',
            component: () => import('@/views/address/index.vue'),
        },
        {
            path: '/order',
            name: 'Order',
            component: () => import('@/views/order/index.vue'),
        },
        {
            path: '/404',
            name: 'NotFound',
            component: () => import('@/views/system/404/index.vue'),
        },
        {
            path: '/auth/:mode?',
            name: 'Auth',
            component: () => import('@/views/auth/index.vue'),
            // mode: optional path param, supports 'login' or 'register'
        },
        {
            path: '/store/:id',
            name: 'Store',
            component: () => import('@/views/store/index.vue'),
        },
        {
            path: '/favorites',
            name: 'Favorites',
            component: () => import('@/views/favorite/index.vue'),
        },
        {
            path: '/cart',
            name: 'Cart',
            component: () => import('@/views/cart/index.vue'),
        },
    ],
})

// to: 目标路由对象
// from: 来源路由对象
// router.beforeEach((to, _from ,next) => {
// const userStore = useUserStore()
// const token = userStore.token
// if (to.path != '/login' && !token) {
//   next('/login')
// } else {
//   next()
// }
// })

export default router
