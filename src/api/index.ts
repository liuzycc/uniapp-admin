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
export const getUserList = () => request({ url: "/user/list", method: "get" });
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
export const getProductList = () =>
  request({ url: "/product/list", method: "get" });

// 添加产品
export const addProductList = (data) =>
  request({ url: "/product/create", method: "post", data });
// 更新产品
export const updateProductList = (data) =>
  request({ url: "/product/update", method: "post", data });
// 删除产品
