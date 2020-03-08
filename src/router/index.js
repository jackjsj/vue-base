import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import RouterModules from './modules';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  ...RouterModules,
];

const router = new VueRouter({
  routes,
});

export default router;
