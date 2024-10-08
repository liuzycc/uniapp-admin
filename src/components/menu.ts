import { Menus } from "@/types/menu";

export const menuData: Menus[] = [
  {
    title: "系统首页",
    index: "/dashboard",
    icon: "Odometer",
  },
  {
    title: "实用工具",
    index: "1",
    icon: "Odometer",
    children: [
      {
        index: "/theme",
        title: "主题设置",
      },
      {
        index: "/util-image",
        title: "图片工具",
      },
    ],
  },
  {
    title: "产品与订单",
    index: "2",
    icon: "HomeFilled",
    children: [
      {
        index: "/product-home",
        title: "首页配置",
      },
      {
        index: "/product-sort",
        title: "分类管理",
      },
      {
        index: "/product-list",
        title: "产品管理",
      },
      {
        index: "/product-shop",
        title: "订单管理",
      },
    ],
  },
  {
    title: "用户管理",
    index: "3",
    icon: "HomeFilled",
    children: [
      {
        index: "/user-list",
        title: "用户管理",
      },
    ],
  },
];
