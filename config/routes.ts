const allPath = [
  {
    name: 'personPortal',
    path: '/',
    component: './JudgePCMob',
    layout: false,
    hideInMenu: true,
  },
  {
    name: 'users',
    icon: 'icon-user',
    path: '/person',
    routes: [
      {
        name: 'selfInfo',
        path: '/person/selfInfo',
        component: './ThePortal/Person',
        layout: false,
        hideInMenu: true,
      },
      {
        name: 'userInfoLs',
        path: '/person/userInfoLs',
        component: './ThePortal/MobAppCenter/userInfo',
        layout: false,
        hideInMenu: true,
      },
      {
        name: 'userApplyfor',
        path: '/person/userapplyfor',
        layout: false,
        component: './ThePortal/MobAppCenter',
        hideInMenu: true,
      },
      {
        name: 'userApplyforControl',
        path: '/person/userapplyforControl',
        layout: false,
        component: './ThePortal/MobAppCenter/mainControl',
        hideInMenu: true,
      },
      {
        name: 'userApplyforRenewal',
        path: '/person/userApplyforRenewal',
        layout: false,
        component: './ThePortal/MobAppCenter/renewal',
        hideInMenu: true,
      },
      {
        name: 'userApplyAdd',
        path: '/person/userapplyAdd',
        layout: false,
        component: './ThePortal/MobAppCenter/addApply',
        hideInMenu: true,
      },
      {
        name: 'userInfors',
        path: '/person/PCuserInfor',
        layout: false,
        component: './ThePortal/PcAppCenter/userInfo',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'noPermissise',
    path: '/noPermissise',
    hideInMenu: true,
    component: './Nopromise',
  },
  {
    path: '/blankPage',
    component: './MiddlePage',
    layout: false,
  },
  {
    path: '/introductionPage',
    component: './IntroductionPage',
    layout: false,
  },
  {
    component: './404',
  },
];

export default allPath;
