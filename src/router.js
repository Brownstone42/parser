import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import UploadPage from './pages/UploadPage.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage 
    },
    { 
        path: '/upload', 
        name: 'upload', 
        component: UploadPage 
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;