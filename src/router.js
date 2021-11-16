import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue'//vue-cli3
import Home from './views/Home.vue';

Vue.use(Router);

/*
const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
})
*/


export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            hidden: true
        }, {
            path: '/home',
            name: 'Home',
            component: Home,
            hidden: true,
            meta: {
                roles: ['admin', 'user']
            },

        }, {
            path: '*',
            redirect: '/home'
        }
    ]
})
