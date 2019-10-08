import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'

Vue.use(Router)

// const ifNotAuthenticated = (to, from, next) => {
//     if (!store.getters.isAuthenticated) {
//         next()
//         return
//     }

//     next('/')
// }

// const ifAuthenticated = (to, from, next) => {
//     if (store.getters.isAuthenticated) {
//         next()
//         return
//     }
//     next('/login')
// }

export default new Router({
    routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    // {
    //     path: '/',
    //     name: 'entry-list',
    //     component: require('@/components/EntryList').default,
    //     beforeEnter: ifAuthenticated
    // },
    // {
    //     path: '/login',
    //     name: 'login-page',
    //     component: require('@/components/LoginPage').default,
    //     beforeEnter: ifNotAuthenticated
    // },
        {
            path: '/',
            name: 'home',
            component: require('@/components/Home').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
