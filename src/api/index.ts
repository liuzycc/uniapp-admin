import request from "../utils/request";

export const fetchData = () => {
  return request({
    url: "./mock/table.json",
    method: "get",
  });
};

export const fetchUserData = () => {
  return request({
    url: "./mock/user.json",
    method: "get",
  });
};

export const fetchRoleData = () => {
  return request({
    url: "./mock/role.json",
    method: "get",
  });
};
// 用户
export const getUserList = (params?: any) =>
  request({ url: "/user/list", method: "get", params });
// 上传图片
export const uploadImage = (data: any) =>
  // @ts-ignore
  request({ url: "/image/upload", method: "post", data, isFormData: true });
// 分类
export const getSortList = () => request({ url: "/sort/list", method: "get" });
// 添加分类
export const addSortList = (data) =>
  request({ url: "/sort/create", method: "post", data });
// 删除分类
export const removeSortList = (data) =>
  request({ url: "/sort/remove", method: "post", data });

// 产品
export const getProductList = (params) =>
  request({ url: "/product/list", method: "get", params });

// 添加产品
export const addProductList = (data) =>
  request({ url: "/product/create", method: "post", data });
// 更新产品
export const updateProductList = (data) =>
  request({ url: "/product/update", method: "post", data });
// 删除产品
export const removeProductList = (data) =>
  request({ url: "/product/remove", method: "post", data });
// 订单
export const getShopList = (params) =>
  request({ url: "/shop/list", method: "get", params });

// 修改订单状态
export const updateShopList = (data) =>
  request({ url: "/shop/update", method: "post", data });

// 首页数据
export const getHomeList = (params) =>
  request({ url: "/home/list", method: "get", params });
// 首页数据
export const createHomeList = (data) =>
  request({ url: "/home/create", method: "post", data });
// 修改首页数据
export const updateHomeList = (data) =>
  request({ url: "/home/update", method: "post", data });
