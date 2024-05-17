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
