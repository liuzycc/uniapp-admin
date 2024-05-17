import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { baseUrl } from "@/environment";
import { ElMessage } from "element-plus";

const service: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
});

service.interceptors.request.use(
  (config: any) => {
    if (config.isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code === 200) {
      return {
        isValid: true,
        ...response.data,
      };
    } else {
      ElMessage({
        message: response.data.message,
        type: "error",
        plain: true,
      });
      Promise.reject();
    }
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
