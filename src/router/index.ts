import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { usePermissStore } from "../store/permiss";
import Home from "../views/home.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { generateToken } from "@/utils";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      },
      {
        path: "/theme",
        name: "theme",
        meta: {
          title: "主题设置",
        },
        component: () =>
          import(/* webpackChunkName: "theme" */ "../views/pages/theme.vue"),
      },
      {
        path: "/util-image",
        name: "util-image",
        meta: {
          title: "图片工具",
        },
        component: () =>
          import(
            /* webpackChunkName: "util-image" */ "../views/util/image/index.vue"
          ),
      },
      {
        path: "/product-home",
        name: "product-home",
        meta: {
          title: "首页配置",
        },
        component: () =>
          import(
            /* webpackChunkName: "product-home" */ "../views/product/home/index.vue"
          ),
      },
      {
        path: "/product-sort",
        name: "product-sort",
        meta: {
          title: "分类管理",
        },
        component: () =>
          import(
            /* webpackChunkName: "product-sort" */ "../views/product/sort/index.vue"
          ),
      },
      {
        path: "/product-list",
        name: "product-list",
        meta: {
          title: "产品管理",
        },
        component: () =>
          import(
            /* webpackChunkName: "product-list" */ "../views/product/list/index.vue"
          ),
      },
      {
        path: "/product-shop",
        name: "product-shop",
        meta: {
          title: "订单管理",
        },
        component: () =>
          import(
            /* webpackChunkName: "product-shop" */ "../views/product/shop/index.vue"
          ),
      },
      {
        path: "/user-list",
        name: "user-list",
        meta: {
          title: "用户管理",
        },
        component: () =>
          import(
            /* webpackChunkName: "user-list" */ "../views/user/list/index.vue"
          ),
      },
    ],
  },
  {
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/pages/login.vue"),
  },
  {
    path: "/404",
    meta: {
      title: "找不到页面",
    },
    component: () =>
      import(/* webpackChunkName: "404" */ "../views/pages/404.vue"),
  },
  { path: "/:path(.*)", redirect: "/404" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.path === "/login") {
    next();
  }
  const dt = generateToken();
  const token = localStorage.getItem("vuems_token");
  if (token && token === dt) {
    next();
  } else {
    next("/login");
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
