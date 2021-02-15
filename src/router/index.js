import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/logins";
import console from "../views/console";

Vue.use(VueRouter);

export const addRoutes = [
  {
    path: "/infomanage",
    name: "Infomanage",
    meta: {
      name: "信息管理",
      icon: "info",
      system:"infoSystem"
    },
    hidden: false,
    component: console,
    children: [
      {
        path: "/infolist",
        name: "Infolist",
        meta: {
          name: "信息列表",
          keepAlive:true
        },
        component: () => import("../views/console/components/content-components/info-list.vue")
      },
      {
        path: "/infocategory",
        name: "Infocategory",
        meta: {
          name: "信息分类",
          keepAlive:true
        },
        component: () => import("../views/console/components/content-components/info-category.vue")
      },
      {
        path: "/infodetails/:options/:details",
        name: "Infodetails",
        meta: {
          name: "信息详情"
        },
        component: () => import("../views/console/components/content-components/info-details.vue")
      }
    ]
  },
  {
    path: "/usermanage",
    name: "Usermanage",
    meta: {
      name: "用户管理",
      icon: "user",
      system:"userSystem"
    },
    component: console,
    children: [
      {
        path: "/userlist",
        name: "Userlist",
        meta: {
          name: "用户列表",
          keepAlive:true
        },
        component: () => import("../views/console/components/content-components/user-list.vue")
      }
    ]
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
];

export const defaultRoutes = [
  {
    path: "/",
    redirect: "/login",
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    component: login,
    hidden: true
  },
  {
    path: "/console",
    name: "Console",
    meta: {
      name: "控制台",
      icon: "console"
    },
    hidden: false,
    component: console,
    children: [
      {
        path: "/mainpage",
        name: "Mainpage",
        meta: {
          name: "首页"
        },
        component: () => import("../views/console/components/content-components/main-page.vue")
      }
    ]
  },
  {
    path: "/page404",
    name: "Page404",
    hidden: true,
    component: console,
    children: [
      {
        path: "/404",
        name: "404",
        component: () => import("../views/console/components/content-components/404.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes:defaultRoutes,
  mode:"hash"
});

export default router;
