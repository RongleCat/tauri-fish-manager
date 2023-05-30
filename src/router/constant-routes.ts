const routes: Route.RecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('@/views/index.vue'),
      },
      {
        path: '/keys',
        name: 'keys',
        component: () => import('@/views/keys.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings.vue'),
      },
    ],
  },
]

export default routes
