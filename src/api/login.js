//登录页面请求接口
import service from "@/utils/request";


//验证码
export function requestCode(data){
    return  service.request({
        method:'post',
        url:'/getSms/',
        data
    });
};      

//注册
export function requestReg(data){
    return service.request({
        method:'post',
        url:'/register/',
        data
    });
};

//登录
export function requestLog(data){
    return service.request({
        method:'post',
        url:'/login/',
        data
    });
};
