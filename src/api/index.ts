import request from "../utils/request";

export const fetchData = (): any => {
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
export const getUserList = (params?: any): any =>
  request({ url: "/user/list", method: "get", params });
// 上传图片
export const uploadImage = (data: any): any =>
  // @ts-ignore
  request({ url: "/image/upload", method: "post", data, isFormData: true });
// 分类
export const getSortList = (): any =>
  request({ url: "/sort/list", method: "get" });
// 添加分类
export const addSortList = (data): any =>
  request({ url: "/sort/create", method: "post", data });
// 更新分类
export const updataSortList = (data): any =>
  request({ url: "/sort/update", method: "post", data });
// 删除分类
export const removeSortList = (data): any =>
  request({ url: "/sort/remove", method: "post", data });

// 产品
export const getProductList = (params): any =>
  request({ url: "/product/list", method: "get", params });

// 添加产品
export const addProductList = (data): any =>
  request({ url: "/product/create", method: "post", data });
// 更新产品
export const updateProductList = (data): any =>
  request({ url: "/product/update", method: "post", data });
// 删除产品
export const removeProductList = (data): any =>
  request({ url: "/product/remove", method: "post", data });
// 订单
export const getShopList = (params): any =>
  request({ url: "/shop/list", method: "get", params });

// 修改订单状态
export const updateShopList = (data): any =>
  request({ url: "/shop/update", method: "post", data });

// 首页数据
export const getHomeList = (params): any =>
  request({ url: "/home/list", method: "get", params });
// 首页数据
export const createHomeList = (data): any =>
  request({ url: "/home/create", method: "post", data });
// 修改首页数据
export const updateHomeList = (data): any =>
  request({ url: "/home/update", method: "post", data });
