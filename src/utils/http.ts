// utils/http.ts
import { ACCESS_TOKEN } from '@/constants';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getStoreItem } from './storage';

// 定义响应数据的通用结构
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 定义扩展的请求配置
interface CustomRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
}

class HttpClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || 'https://backend.paraqon-test.starsnet.com.hk/api/customer';
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization":  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzUxMzY2NDU3N2NkZDUzMzNmOGU3MGUzYzI5MTYwMjFiZjZhODNlM2MyM2U4NWZlM2ZmMDgxMDgzYjU0ZGNiYzBjNWEyMjc4NTI3ZmNkZTgiLCJpYXQiOjE3NjA2Nzk4NDcuNTU2NDI0LCJuYmYiOjE3NjA2Nzk4NDcuNTU2NDM2LCJleHAiOjE3OTIyMTU4NDcuNTQ4MjIsInN1YiI6IjczNzgzIiwic2NvcGVzIjpbXX0.iRAlOnCEnf8XoPKTxJDczQZfKPt9QMTZKKu09c9tXP2_Gs8Brt-6f-WbJfViyV3JD0H59ZCTKSuFT2TSC4dtSdW8xzFLXBHTp7yVHpZiAL_4UEcKE-4ECjh0_0GY-9aR_kdxh87iWxnxd7LfmvO48p9-QlE9i56e7_En60hMC_v87AOE8unmayAEA0I_ZunPa1e2du4Cq5a2yt7Z82iaJXgnRzhlD7gWS3ikCWnEnmWrEru2YZneHqO6rHG9GCnpLbdnVa0OCs1yRpabmRposOikayVRZ38-xyJzCsR9EX_iSHCIOQ4IV0asqLDTDv6WcuUC9cR3t7PAfQ4JhNVVVBCVuB4hgpaUSU9GjBZDzU6n8kOmAxFzILbq2do-D-KFR1p5ZwEgm1G4aDDh2fcHEoYATmRWHSE9lHdTTwKvEc8p37bOWoKXLeOd5N3HGWRwJVOMbARuYLfB5GCPyDgsqVbbWe9L3q3bET0811v0retnOI64TVrgI2DjvwQlEenseos8aQzeSUDHw4D6vRUsOs__21OkVVZaQ-7MxvAHZmG-6bVpwhpBBYIh73A_9Nteo5Sqm8lBGqZ2KPltlwgwXwmxB-899Q9BOk1pEL2V7S743TRRxDzvATfOlfwjHZVWKGROAKm8lUEo0tne0ZQ9w_LyaUcyIq2ZRS0zLkxlZYo",
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 判断是否为完整 URL（包含 http:// 或 https://）
  private isFullUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  // 获取请求配置 - 处理完整 URL 的情况
  private getRequestConfig(config: CustomRequestConfig): CustomRequestConfig {
    // 如果是完整 URL，移除 baseURL
    if (this.isFullUrl(config.url || '')) {
      const { baseURL, ...restConfig } = config;
      return restConfig;
    }
    return config;
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log("config.url",config.url)
        if (!this.isFullUrl(config.url || '')) {
          const token = getStoreItem(ACCESS_TOKEN);
          const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzUxMzY2NDU3N2NkZDUzMzNmOGU3MGUzYzI5MTYwMjFiZjZhODNlM2MyM2U4NWZlM2ZmMDgxMDgzYjU0ZGNiYzBjNWEyMjc4NTI3ZmNkZTgiLCJpYXQiOjE3NjA2Nzk4NDcuNTU2NDI0LCJuYmYiOjE3NjA2Nzk4NDcuNTU2NDM2LCJleHAiOjE3OTIyMTU4NDcuNTQ4MjIsInN1YiI6IjczNzgzIiwic2NvcGVzIjpbXX0.iRAlOnCEnf8XoPKTxJDczQZfKPt9QMTZKKu09c9tXP2_Gs8Brt-6f-WbJfViyV3JD0H59ZCTKSuFT2TSC4dtSdW8xzFLXBHTp7yVHpZiAL_4UEcKE-4ECjh0_0GY-9aR_kdxh87iWxnxd7LfmvO48p9-QlE9i56e7_En60hMC_v87AOE8unmayAEA0I_ZunPa1e2du4Cq5a2yt7Z82iaJXgnRzhlD7gWS3ikCWnEnmWrEru2YZneHqO6rHG9GCnpLbdnVa0OCs1yRpabmRposOikayVRZ38-xyJzCsR9EX_iSHCIOQ4IV0asqLDTDv6WcuUC9cR3t7PAfQ4JhNVVVBCVuB4hgpaUSU9GjBZDzU6n8kOmAxFzILbq2do-D-KFR1p5ZwEgm1G4aDDh2fcHEoYATmRWHSE9lHdTTwKvEc8p37bOWoKXLeOd5N3HGWRwJVOMbARuYLfB5GCPyDgsqVbbWe9L3q3bET0811v0retnOI64TVrgI2DjvwQlEenseos8aQzeSUDHw4D6vRUsOs__21OkVVZaQ-7MxvAHZmG-6bVpwhpBBYIh73A_9Nteo5Sqm8lBGqZ2KPltlwgwXwmxB-899Q9BOk1pEL2V7S743TRRxDzvATfOlfwjHZVWKGROAKm8lUEo0tne0ZQ9w_LyaUcyIq2ZRS0zLkxlZYo'
          if (testToken && config.headers) {
            console.log("成功设置token", testToken);
            // config.headers.Authorization = `Bearer ${testToken}`;
          }
        }

        if ((config as CustomRequestConfig).showLoading) {
          this.showLoading();
        }

        return config;
      },
      (error) => {
        console.error('❌ 请求错误:', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if ((response.config as CustomRequestConfig).showLoading) {
          this.hideLoading();
        }
        return response.data;
      },
      (error) => {
        if (error.config?.showLoading) {
          this.hideLoading();
        }

        console.error('❌ 响应错误:', error.response?.status, error.message);

        if (error.config?.showError !== false) {
          this.handleError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private showLoading() {
    console.log('🔄 加载中...');
    // 例如：Toast.loading('加载中...');
  }

  private hideLoading() {
    // 隐藏加载提示
    console.log('✅ 加载完成');
    // 例如：Toast.hide();
  }

  private handleError(error: any) {
    const status = error.response?.status;
    let message = '请求失败，请稍后重试';

    switch (status) {
      case 400:
        message = '请求参数错误';
        break;
      case 401:
        message = '未授权，请重新登录';
        // 跳转到登录页
        // navigate('/login');
        break;
      case 403:
        message = '拒绝访问';
        break;
      case 404:
        message = '请求地址不存在';
        break;
      case 500:
        message = '服务器内部错误';
        break;
      case 502:
        message = '网关错误';
        break;
      case 503:
        message = '服务不可用';
        break;
      default:
        message = error.message || '网络连接失败';
    }

    // 显示错误提示
    console.error('❌ 错误信息:', message);
    // 例如：Toast.error(message);
  }

  // 通用请求方法
  public async request<T = any>(config: CustomRequestConfig): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig(config);
    return this.instance.request(finalConfig);
  }

  // GET 请求
  public async get<T = any>(
    url: string,
    params?: any,
    config?: CustomRequestConfig
  ): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig({
      method: 'GET',
      url,
      params,
      ...config,
    });
    return this.request<T>(finalConfig);
  }

  // POST 请求
  public async post<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig({
      method: 'POST',
      url,
      data,
      ...config,
    });
    return this.request<T>(finalConfig);
  }

  // PUT 请求
  public async put<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig({
      method: 'PUT',
      url,
      data,
      ...config,
    });
    return this.request<T>(finalConfig);
  }

  // DELETE 请求
  public async delete<T = any>(
    url: string,
    params?: any,
    config?: CustomRequestConfig
  ): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig({
      method: 'DELETE',
      url,
      params,
      ...config,
    });
    return this.request<T>(finalConfig);
  }

  // PATCH 请求
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
    return this.request<T>(finalConfig);
  }

  // 上传文件
  public async upload<T = any>(
    url: string,
    formData: FormData,
    config?: CustomRequestConfig
  ): Promise<ResponseData<T>> {
    const finalConfig = this.getRequestConfig({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
    return this.request<T>(finalConfig);
  }

  // 下载文件
  public async download(
    url: string,
    params?: any,
    config?: CustomRequestConfig
  ): Promise<Blob> {
    const finalConfig = this.getRequestConfig({
      method: 'GET',
      url,
      params,
      responseType: 'blob',
      ...config,
    });
    
    const response = await this.instance(finalConfig);
    return response.data;
  }
}

const testBaseURL = "https://backend.paraqon-test.starsnet.com.hk/api/customer"

// 创建默认实例
const http = new HttpClient(testBaseURL);

// 导出常用的方法
export const get = http.get.bind(http);
export const post = http.post.bind(http);
export const put = http.put.bind(http);
export const del = http.delete.bind(http);
export const patch = http.patch.bind(http);
export const upload = http.upload.bind(http);
export const download = http.download.bind(http);

// 导出默认实例
export default http;