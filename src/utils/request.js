//请求响应拦截器
import axios from "axios";
import { ColorPicker } from "element-ui";


const service = axios.create({
    baseURL: '/api',
    timeout : 2500   //传不回来就失效
});

service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么（一般对请求头做些什么）
    config.headers['Tokey'] = sessionStorage.getItem('token')
    config.headers['UserName'] = sessionStorage.getItem('username')
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    if(response.data.resCode !==0){
        return Promise.reject(response);
    }


    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


export default service;