
import {createRouter, createWebHistory} from 'vue-router';
import { jwtDecode } from "jwt-decode";

const routes = [
    {path: '/', redirect: '/products'},
    {path: '/products', name: 'Products', component: () => import(/* webpackChunkName: "products" */ '@/components/Products.vue'), meta: {requiresAuth: true}},
    {path: '/dashboard', name: 'Dashboard', component: () => import(/* webpackChunkName: "dashboard" */ '@/components/Dashboard.vue'), meta: {requiresAuth: true, role: 'administrator'}},
    {path: '/users', name: 'Users', component: () => import(/* webpackChunkName: "user" */ '@/components/Users.vue'), meta: {requiresAuth: true, role: 'administrator'}},
    {path: '/product/:id', name: 'Product', component: () => import(/* webpackChunkName: "product" */ '@/components/Product.vue'), meta: {requiresAuth: true , role: 'administrator'}},
    {path: '/login', name: 'Login', component: () => import(/* webpackChunkName: "login" */ '@/components/Login.vue'), meta: {requiresAuth: false}},
    {path: '/register', name: 'Register', component: () => import(/* webpackChunkName: "register" */ '@/components/Register.vue'), meta: {requiresAuth: false}},
    {path: '/user/:id', name: 'User', component: () => import(/* webpackChunkName: "user" */ '@/components/User.vue'), meta:{requiresAuth: true}},
    {path: '/payment' , name: 'Payment', component: () => import(/* webpackChunkName: "payment" */ '@/components/PaymentMercadoLibre.vue'), meta:{requiresAuth: true}}

];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach((to, from, next) => {

    if(to.meta.requiresAuth){
        const token = localStorage.getItem('user_token');
        if (!token) return next('/login');

        const currentTime = Date.now() / 1000; // Tiempo actual en segundos
        const decoded = jwtDecode(token);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log(decoded.exp < currentTime)
        if(decoded.exp < currentTime){
            localStorage.removeItem('user_token');
            return next('/login');
        }


        if(to.meta.role != undefined && to.meta.role !== userRole){
            alert('No tienes permiso para acceder aqui');
            return next('/products');
        }
        else
            next();
        
    }else
        next();

});

export default router;