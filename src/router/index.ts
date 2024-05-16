import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { usePermissStore } from "../store/permiss";
import Home from "../views/home.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

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
    path: "/theme",
    name: "theme",
    meta: {
      title: "主题设置",
      permiss: "7",
    },
    component: () =>
      import(/* webpackChunkName: "theme" */ "../views/pages/theme.vue"),
  },
  {
    path: "/login",
    meta: {
      title: "登录",
      noAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/pages/login.vue"),
  },
  {
    path: "/register",
    meta: {
      title: "注册",
      noAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/pages/register.vue"),
  },
  {
    path: "/reset-pwd",
    meta: {
      title: "重置密码",
      noAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "reset-pwd" */ "../views/pages/reset-pwd.vue"
      ),
  },
  {
    path: "/403",
    meta: {
      title: "没有权限",
      noAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "403" */ "../views/pages/403.vue"),
  },
  {
    path: "/404",
    meta: {
      title: "找不到页面",
      noAuth: true,
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
  const role = localStorage.getItem("vuems_name");
  const permiss = usePermissStore();

  //   if (!role && to.meta.noAuth !== true) {
  //     next("/login");
  //   } else if (
  //     typeof to.meta.permiss == "string" &&
  //     !permiss.key.includes(to.meta.permiss)
  //   ) {
  //     // 如果没有权限，则进入403
  //     next("/403");
  //   } else {
  //     next();
  //   }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
