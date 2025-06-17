import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import UploadSO from './pages/UploadSO.vue';
import UploadIV from './pages/UploadIV.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage 
    },
    { 
        path: '/upload/so', 
        name: 'uploadSO', 
        component: UploadSO 
    },
    { 
        path: '/upload/iv', 
        name: 'uploadIV', 
        component: UploadIV 
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;