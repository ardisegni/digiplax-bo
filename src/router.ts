import LoginComponent from '@/views/login/Login.component';
import Vue from 'vue';
import Router, { NavigationGuard } from 'vue-router';
import store from './store';
import DashboardComponent from './views/dashboard/Dashboard.component';
import PlaquesListComponent from './views/plaques-list/PlaquesList.component';
import ProjectsListComponent from './views/projects-list/ProjectsList.component';
import SchedulerComponent from './views/scheduler/Scheduler.component';
import UsersListComponent from './views/users-list/UsersList.component';

Vue.use(Router);

const authGuard: NavigationGuard = (_to, _from, next) => {
  if (store.getters.isLoggedIn) {
    next();
  } else {
    next({ name: 'login' });
  }
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginComponent,
      meta: { hideDashboard: true }
    },
    {
      path: '/home',
      name: 'home',
      component: DashboardComponent,
      beforeEnter: authGuard
    },
    {
      path: '/plaques',
      name: 'plaques',
      component: PlaquesListComponent,
      beforeEnter: authGuard
    },
    {
      path: '/users',
      name: 'users',
      component: UsersListComponent,
      beforeEnter: authGuard
    },
    {
      path: '/scheduler',
      name: 'scheduler',
      component: SchedulerComponent,
      beforeEnter: authGuard
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsListComponent,
      beforeEnter: authGuard
    }
  ]
});
