import {RouteConfig} from 'vue-router';
import {PageNames} from "src/router/names";
import {Permission} from "src/router/permissions";

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: PageNames.Main,
        component: () => import('pages/Index.vue'),
        meta: {
          auth: true,
          permissions: [Permission.User, Permission.Admin]
        },
      },
      {
        path: '/signin',
        name: PageNames.Signin,
        component: () => import('pages/Login.vue')
      },
      {
        path: '/markup',
        name: PageNames.Markup,
        component: () => import('pages/MarkupPage.vue'),
        meta: {
          auth: true,
          permissions: [Permission.User, Permission.Admin]
        },
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
